package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.RequestPriority;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.entity.Hospital;
import com.bloodlink.bloodlink_backend.repo.DonorMatchRepository;
import com.bloodlink.bloodlink_backend.repo.DonorRepo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.*;

/**
 * Unit tests for MatchingServiceImp.
 *
 * PostGIS itself is mocked here.
 * These tests verify that the matching service correctly uses
 * the spatial repository result and applies business rules.
 */
@ExtendWith(MockitoExtension.class)
class MatchingServiceImpTest {

    @Mock
    private DonorRepo donorRepo;

    @Mock
    private DonorMatchRepository donorMatchRepository;

    @InjectMocks
    private MatchingServiceImp matchingService;


    private BloodRequest request;
    private Hospital hospital;


    // =========================================================
    // SETUP
    // =========================================================

    @BeforeEach
    void setUp() {

        hospital = new Hospital();

        hospital.setLatitude(26.9124);
        hospital.setLongitude(75.7873);


        request = new BloodRequest();

        request.setHospital(hospital);

        request.setBloodGroup(
                BloodGroup.A_POSITIVE
        );

        request.setPriority(
                RequestPriority.HIGH
        );
    }


    // =========================================================
    // HELPER - CREATE DONOR
    // =========================================================

    private Donor createDonor(
            BloodGroup bloodGroup,
            double latitude,
            double longitude) {

        Donor donor = new Donor();

        donor.setBloodGroup(bloodGroup);

        donor.setLatitude(latitude);
        donor.setLongitude(longitude);

        donor.setAvailable(true);

        donor.setSuccessfulDonations(0);

        donor.setTotalRequestsAccepted(0);

        donor.setTotalRequestsRejected(0);

        donor.setBloodLinkScore(0.0);

        return donor;
    }


    // =========================================================
    // TEST 1
    // ELIGIBLE DONOR
    // =========================================================

    @Test
    void shouldReturnEligibleDonor() {

        Donor donor = createDonor(
                BloodGroup.A_POSITIVE,
                26.9130,
                75.7880
        );


        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(List.of(donor));


        List<Donor> result =
                matchingService.findEligibleDonors(request);


        assertEquals(1, result.size());

        assertEquals(
                donor,
                result.get(0)
        );


        verify(
                donorRepo
        ).findAvailableDonorsWithinRadius(
                eq(26.9124),
                eq(75.7873),
                eq(25000.0)
        );
    }


    // =========================================================
    // TEST 2
    // DONOR DONATED WITHIN 90 DAYS
    // =========================================================

    @Test
    void shouldRejectDonorWhoDonatedWithin90Days() {

        Donor donor = createDonor(
                BloodGroup.A_POSITIVE,
                26.9130,
                75.7880
        );


        donor.setLastDonationDate(
                LocalDate.now().minusDays(30)
        );


        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(List.of(donor));


        List<Donor> result =
                matchingService.findEligibleDonors(request);


        assertTrue(result.isEmpty());
    }


    // =========================================================
    // TEST 3
    // DONOR WITH NO PREVIOUS DONATION
    // =========================================================

    @Test
    void shouldAllowDonorWithNoPreviousDonation() {

        Donor donor = createDonor(
                BloodGroup.A_POSITIVE,
                26.9130,
                75.7880
        );


        donor.setLastDonationDate(null);


        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(List.of(donor));


        List<Donor> result =
                matchingService.findEligibleDonors(request);


        assertEquals(1, result.size());

        assertEquals(
                donor,
                result.get(0)
        );
    }


    // =========================================================
    // TEST 4
    // INCOMPATIBLE BLOOD GROUP
    // =========================================================

    @Test
    void shouldRejectIncompatibleBloodGroup() {

        Donor donor = createDonor(
                BloodGroup.B_POSITIVE,
                26.9130,
                75.7880
        );


        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(List.of(donor));


        List<Donor> result =
                matchingService.findEligibleDonors(request);


        assertTrue(result.isEmpty());
    }


    // =========================================================
    // TEST 5
    // ONLY ELIGIBLE DONORS SHOULD BE RETURNED
    // =========================================================

    @Test
    void shouldReturnOnlyEligibleDonors() {

        Donor eligibleDonor =
                createDonor(
                        BloodGroup.A_POSITIVE,
                        26.9130,
                        75.7880
                );


        Donor recentDonor =
                createDonor(
                        BloodGroup.A_POSITIVE,
                        26.9140,
                        75.7890
                );

        recentDonor.setLastDonationDate(
                LocalDate.now().minusDays(20)
        );


        Donor incompatibleDonor =
                createDonor(
                        BloodGroup.B_POSITIVE,
                        26.9150,
                        75.7900
                );


        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(
                List.of(
                        eligibleDonor,
                        recentDonor,
                        incompatibleDonor
                )
        );


        List<Donor> result =
                matchingService.findEligibleDonors(request);


        assertEquals(1, result.size());

        assertEquals(
                eligibleDonor,
                result.get(0)
        );
    }


    // =========================================================
    // TEST 6
    // NO AVAILABLE DONORS
    // =========================================================

    @Test
    void shouldReturnEmptyWhenNoAvailableDonors() {

        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(List.of());


        List<Donor> result =
                matchingService.findEligibleDonors(request);


        assertTrue(result.isEmpty());
    }


    // =========================================================
    // TEST 7
    // POSTGIS RADIUS FOR HIGH PRIORITY
    // =========================================================

    @Test
    void shouldUse25KmRadiusForHighPriority() {

        request.setPriority(
                RequestPriority.HIGH
        );


        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(List.of());


        matchingService.findEligibleDonors(request);


        verify(
                donorRepo
        ).findAvailableDonorsWithinRadius(
                eq(26.9124),
                eq(75.7873),
                eq(25000.0)
        );
    }


    // =========================================================
    // TEST 8
    // POSTGIS RADIUS FOR CRITICAL
    // =========================================================

    @Test
    void shouldUse10KmRadiusForCriticalPriority() {

        request.setPriority(
                RequestPriority.CRITICAL
        );


        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(List.of());


        matchingService.findEligibleDonors(request);


        verify(
                donorRepo
        ).findAvailableDonorsWithinRadius(
                eq(26.9124),
                eq(75.7873),
                eq(10000.0)
        );
    }


    // =========================================================
    // TEST 9
    // DEFAULT RADIUS
    // =========================================================

    @Test
    void shouldUse50KmRadiusWhenPriorityIsNull() {

        request.setPriority(null);


        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(List.of());


        matchingService.findEligibleDonors(request);


        verify(
                donorRepo
        ).findAvailableDonorsWithinRadius(
                eq(26.9124),
                eq(75.7873),
                eq(50000.0)
        );
    }


    // =========================================================
    // TEST 10
    // RANK DONORS
    // =========================================================

    @Test
    void shouldRankHigherScoringDonorFirst() {

        Donor donor1 =
                createDonor(
                        BloodGroup.A_POSITIVE,
                        26.9130,
                        75.7880
                );


        Donor donor2 =
                createDonor(
                        BloodGroup.A_POSITIVE,
                        26.9200,
                        75.7950
                );


        donor1.setSuccessfulDonations(10);
        donor1.setTotalRequestsAccepted(10);
        donor1.setTotalRequestsRejected(0);
        donor1.setBloodLinkScore(90.0);


        donor2.setSuccessfulDonations(1);
        donor2.setTotalRequestsAccepted(1);
        donor2.setTotalRequestsRejected(5);
        donor2.setBloodLinkScore(20.0);


        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(
                List.of(
                        donor1,
                        donor2
                )
        );


        when(
                donorMatchRepository.save(
                        any(DonorMatch.class)
                )
        ).thenAnswer(
                invocation ->
                        invocation.getArgument(0)
        );


        List<DonorMatch> result =
                matchingService.rankDonors(request);


        assertEquals(2, result.size());


        assertTrue(
                result.get(0).getFinalScore()
                        >= result.get(1).getFinalScore()
        );


        assertEquals(
                1,
                result.get(0).getRank()
        );


        assertEquals(
                2,
                result.get(1).getRank()
        );


        verify(
                donorMatchRepository,
                times(2)
        ).save(
                any(DonorMatch.class)
        );
    }


    // =========================================================
    // TEST 11
    // MAXIMUM 10 MATCHES
    // =========================================================

    @Test
    void shouldReturnMaximumTenMatches() {

        List<Donor> donors =
                new ArrayList<>();


        for (int i = 0; i < 15; i++) {

            Donor donor =
                    createDonor(
                            BloodGroup.A_POSITIVE,
                            26.9124 + (i * 0.001),
                            75.7873 + (i * 0.001)
                    );

            donor.setSuccessfulDonations(i);

            donor.setTotalRequestsAccepted(i);

            donor.setTotalRequestsRejected(0);

            donor.setBloodLinkScore(
                    (double) i
            );

            donors.add(donor);
        }


        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(donors);


        when(
                donorMatchRepository.save(
                        any(DonorMatch.class)
                )
        ).thenAnswer(
                invocation ->
                        invocation.getArgument(0)
        );


        List<DonorMatch> result =
                matchingService.rankDonors(request);


        assertEquals(
                10,
                result.size()
        );


        assertEquals(
                1,
                result.get(0).getRank()
        );


        assertEquals(
                10,
                result.get(9).getRank()
        );


        verify(
                donorMatchRepository,
                times(15)
        ).save(
                any(DonorMatch.class)
        );
    }


    // =========================================================
    // TEST 12
    // EMPTY RANKING
    // =========================================================

    @Test
    void shouldReturnEmptyRankingWhenNoEligibleDonors() {

        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(List.of());


        List<DonorMatch> result =
                matchingService.rankDonors(request);


        assertTrue(result.isEmpty());


        verify(
                donorMatchRepository,
                never()
        ).save(
                any(DonorMatch.class)
        );
    }
}