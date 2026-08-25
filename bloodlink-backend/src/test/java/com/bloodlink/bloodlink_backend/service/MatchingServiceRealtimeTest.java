package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.RequestPriority;
import com.bloodlink.bloodlink_backend.dto.EmergencyAlert;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.entity.Hospital;
import com.bloodlink.bloodlink_backend.repo.DonorMatchRepository;
import com.bloodlink.bloodlink_backend.repo.DonorRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MatchingServiceRealtimeTest {

    @Mock
    private DonorRepo donorRepo;

    @Mock
    private DonorMatchRepository donorMatchRepository;

    @Mock
    private RealtimeNotificationService realtimeNotificationService;

    @InjectMocks
    private MatchingServiceImp matchingService;

    private BloodRequest request;
    private Hospital hospital;

    @BeforeEach
    void setUp() {

        hospital = new Hospital();

        hospital.setLatitude(26.9124);
        hospital.setLongitude(75.7873);
        hospital.setHospitalName("City Hospital");
        hospital.setCity("Jaipur");

        request = new BloodRequest();

        request.setHospital(hospital);
        request.setBloodGroup(BloodGroup.O_NEGATIVE);
        request.setPriority(RequestPriority.CRITICAL);
        request.setUnitsRequired(2);
        request.setId(UUID.randomUUID());
    }

    // =====================================================
    // HELPER
    // =====================================================

    private Donor createDonor(
            BloodGroup bloodGroup,
            double latitude,
            double longitude) {

        Donor donor = new Donor();

        donor.setId(UUID.randomUUID());

        donor.setBloodGroup(bloodGroup);

        donor.setLatitude(latitude);
        donor.setLongitude(longitude);

        donor.setAvailable(true);

        donor.setSuccessfulDonations(5);

        donor.setTotalRequestsAccepted(5);

        donor.setTotalRequestsRejected(0);

        donor.setBloodLinkScore(80.0);

        donor.setLastDonationDate(null);

        return donor;
    }

    // =====================================================
    // TEST 1
    // CRITICAL REQUEST SHOULD SEND REAL-TIME ALERT
    // =====================================================

    @Test
    void shouldSendRealtimeAlertForCriticalRequest() {

        Donor donor =
                createDonor(
                        BloodGroup.O_NEGATIVE,
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

        when(
                donorMatchRepository.save(
                        any(DonorMatch.class)
                )
        ).thenAnswer(
                invocation ->
                        invocation.getArgument(0)
        );

        matchingService.rankDonors(request);

        verify(
                realtimeNotificationService,
                times(1)
        ).sendEmergencyAlert(
                eq(donor.getId()),
                any(EmergencyAlert.class)
        );
    }

    // =====================================================
    // TEST 2
    // MULTIPLE DONORS SHOULD RECEIVE ALERTS
    // =====================================================

    @Test
    void shouldSendAlertToAllTopEligibleDonors() {

        Donor donor1 =
                createDonor(
                        BloodGroup.O_NEGATIVE,
                        26.9130,
                        75.7880
                );

        Donor donor2 =
                createDonor(
                        BloodGroup.O_NEGATIVE,
                        26.9140,
                        75.7890
                );

        when(
                donorRepo.findAvailableDonorsWithinRadius(
                        anyDouble(),
                        anyDouble(),
                        anyDouble()
                )
        ).thenReturn(
                List.of(donor1, donor2)
        );

        when(
                donorMatchRepository.save(
                        any(DonorMatch.class)
                )
        ).thenAnswer(
                invocation ->
                        invocation.getArgument(0)
        );

        matchingService.rankDonors(request);

        verify(
                realtimeNotificationService,
                times(2)
        ).sendEmergencyAlert(
                any(UUID.class),
                any(EmergencyAlert.class)
        );

        verify(
                realtimeNotificationService
        ).sendEmergencyAlert(
                eq(donor1.getId()),
                any(EmergencyAlert.class)
        );

        verify(
                realtimeNotificationService
        ).sendEmergencyAlert(
                eq(donor2.getId()),
                any(EmergencyAlert.class)
        );
    }

    // =====================================================
    // TEST 3
    // NON-CRITICAL REQUEST SHOULD NOT SEND WEBSOCKET
    // =====================================================

    @Test
    void shouldNotSendRealtimeAlertForNormalRequest() {

        request.setPriority(RequestPriority.HIGH);

        Donor donor =
                createDonor(
                        BloodGroup.O_NEGATIVE,
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

        when(
                donorMatchRepository.save(
                        any(DonorMatch.class)
                )
        ).thenAnswer(
                invocation ->
                        invocation.getArgument(0)
        );

        matchingService.rankDonors(request);

        verify(
                realtimeNotificationService,
                never()
        ).sendEmergencyAlert(
                any(UUID.class),
                any(EmergencyAlert.class)
        );
    }

    // =====================================================
    // TEST 4
    // ALERT SHOULD CONTAIN CORRECT INFORMATION
    // =====================================================

    @Test
    void shouldSendCorrectEmergencyAlertData() {

        Donor donor =
                createDonor(
                        BloodGroup.O_NEGATIVE,
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

        when(
                donorMatchRepository.save(
                        any(DonorMatch.class)
                )
        ).thenAnswer(
                invocation ->
                        invocation.getArgument(0)
        );

        matchingService.rankDonors(request);

        ArgumentCaptor<EmergencyAlert> captor =
                ArgumentCaptor.forClass(
                        EmergencyAlert.class
                );

        verify(
                realtimeNotificationService
        ).sendEmergencyAlert(
                eq(donor.getId()),
                captor.capture()
        );

        EmergencyAlert alert =
                captor.getValue();

        assertNotNull(alert);

        assertEquals(
                request.getId(),
                alert.getRequestId()
        );

        assertEquals(
                BloodGroup.O_NEGATIVE,
                alert.getBloodGroup()
        );

        assertEquals(
                "City Hospital",
                alert.getHospitalName()
        );

        assertEquals(
                "Jaipur",
                alert.getCity()
        );

        assertEquals(
                2,
                alert.getUnitsRequired()
        );

        assertEquals(
                RequestPriority.CRITICAL,
                alert.getPriority()
        );

        assertNotNull(
                alert.getDistanceKm()
        );
    }
}