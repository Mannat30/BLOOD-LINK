package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.DonationHistoryRequest;
import com.bloodlink.bloodlink_backend.dto.DonationHistoryResponse;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.DonationHistory;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.entity.Notification;
import com.bloodlink.bloodlink_backend.repo.DonationHistoryRepository;
import com.bloodlink.bloodlink_backend.repo.NotificationRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class DonationHistoryServiceImplTest {

    @Mock
    private DonationHistoryRepository donationHistoryRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private DonationHistoryServiceImpl donationHistoryService;

    private UUID notificationId;
    private UUID donationId;
    private UUID donorId;
    private UUID requestId;

    private Notification notification;
    private DonorMatch donorMatch;
    private Donor donor;
    private BloodRequest bloodRequest;

    private DonationHistoryRequest request;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        notificationId = UUID.randomUUID();
        donationId = UUID.randomUUID();
        donorId = UUID.randomUUID();
        requestId = UUID.randomUUID();


        // =========================
        // DONOR
        // =========================

        donor = new Donor();

        donor.setId(donorId);


        // =========================
        // BLOOD REQUEST
        // =========================

        bloodRequest = new BloodRequest();

        bloodRequest.setId(requestId);


        // =========================
        // DONOR MATCH
        // =========================

        donorMatch = new DonorMatch();

        donorMatch.setDonor(donor);

        donorMatch.setBloodRequest(
                bloodRequest
        );


        // =========================
        // NOTIFICATION
        // =========================

        notification = new Notification();

        notification.setDonorMatch(
                donorMatch
        );


        // =========================
        // REQUEST
        // =========================

        request = new DonationHistoryRequest();

        request.setUnitsDonated(2);
    }


    // =====================================================
    // TEST 1
    // CREATE DONATION
    // =====================================================

    @Test
    void shouldCreateDonation() {

        when(
                notificationRepository.findById(
                        notificationId
                )
        ).thenReturn(
                Optional.of(notification)
        );


        when(
                donationHistoryRepository.save(
                        any(DonationHistory.class)
                )
        ).thenAnswer(invocation -> {

            DonationHistory donation =
                    invocation.getArgument(0);

            donation.setId(donationId);

            donation.setDonationDate(
                    LocalDateTime.now()
            );

            return donation;
        });


        DonationHistoryResponse response =
                donationHistoryService.donate(
                        notificationId,
                        request
                );


        assertNotNull(response);


        assertEquals(
                donationId,
                response.getDonationId()
        );


        assertEquals(
                donorId,
                response.getDonorId()
        );


        assertEquals(
                requestId,
                response.getRequestId()
        );


        assertEquals(
                2,
                response.getUnitsDonated()
        );


        assertTrue(
                response.getSuccessful()
        );


        assertNotNull(
                response.getDonationDate()
        );


        verify(
                notificationRepository,
                times(1)
        ).findById(notificationId);


        verify(
                donationHistoryRepository,
                times(1)
        ).save(
                any(DonationHistory.class)
        );
    }


    // =====================================================
    // TEST 2
    // NOTIFICATION NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenNotificationDoesNotExist() {

        when(
                notificationRepository.findById(
                        notificationId
                )
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donationHistoryService.donate(
                                        notificationId,
                                        request
                                )
                );


        assertEquals(
                "Notification Not Found",
                exception.getMessage()
        );


        verify(
                donationHistoryRepository,
                never()
        ).save(any(DonationHistory.class));
    }


    // =====================================================
    // TEST 3
    // DONOR MATCH NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenDonorMatchDoesNotExist() {

        notification.setDonorMatch(null);


        when(
                notificationRepository.findById(
                        notificationId
                )
        ).thenReturn(
                Optional.of(notification)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donationHistoryService.donate(
                                        notificationId,
                                        request
                                )
                );


        assertEquals(
                "Donor Match Not Found",
                exception.getMessage()
        );


        verify(
                donationHistoryRepository,
                never()
        ).save(any(DonationHistory.class));
    }


    // =====================================================
    // TEST 4
    // ZERO UNITS
    // =====================================================

    @Test
    void shouldRejectZeroUnits() {

        request.setUnitsDonated(0);


        when(
                notificationRepository.findById(
                        notificationId
                )
        ).thenReturn(
                Optional.of(notification)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donationHistoryService.donate(
                                        notificationId,
                                        request
                                )
                );


        assertEquals(
                "Units donated must be greater than 0",
                exception.getMessage()
        );


        verify(
                donationHistoryRepository,
                never()
        ).save(any(DonationHistory.class));
    }


    // =====================================================
    // TEST 5
    // NULL UNITS
    // =====================================================

    @Test
    void shouldRejectNullUnits() {

        request.setUnitsDonated(null);


        when(
                notificationRepository.findById(
                        notificationId
                )
        ).thenReturn(
                Optional.of(notification)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donationHistoryService.donate(
                                        notificationId,
                                        request
                                )
                );


        assertEquals(
                "Units donated must be greater than 0",
                exception.getMessage()
        );


        verify(
                donationHistoryRepository,
                never()
        ).save(any(DonationHistory.class));
    }


    // =====================================================
    // TEST 6
    // NEGATIVE UNITS
    // =====================================================

    @Test
    void shouldRejectNegativeUnits() {

        request.setUnitsDonated(-5);


        when(
                notificationRepository.findById(
                        notificationId
                )
        ).thenReturn(
                Optional.of(notification)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donationHistoryService.donate(
                                        notificationId,
                                        request
                                )
                );


        assertEquals(
                "Units donated must be greater than 0",
                exception.getMessage()
        );


        verify(
                donationHistoryRepository,
                never()
        ).save(any(DonationHistory.class));
    }


    // =====================================================
    // TEST 7
    // GET ALL DONATIONS
    // =====================================================

    @Test
    void shouldGetAllDonations() {

        DonationHistory donation1 =
                new DonationHistory();

        donation1.setId(
                UUID.randomUUID()
        );

        donation1.setDonor(donor);

        donation1.setBloodRequest(
                bloodRequest
        );

        donation1.setUnitsDonated(2);

        donation1.setSuccessful(true);

        donation1.setDonationDate(
                LocalDateTime.now()
        );


        DonationHistory donation2 =
                new DonationHistory();

        donation2.setId(
                UUID.randomUUID()
        );

        donation2.setDonor(donor);

        donation2.setBloodRequest(
                bloodRequest
        );

        donation2.setUnitsDonated(3);

        donation2.setSuccessful(true);

        donation2.setDonationDate(
                LocalDateTime.now()
        );


        when(
                donationHistoryRepository.findAll()
        ).thenReturn(
                List.of(
                        donation1,
                        donation2
                )
        );


        List<DonationHistoryResponse> result =
                donationHistoryService
                        .getAllDonations();


        assertNotNull(result);


        assertEquals(
                2,
                result.size()
        );


        assertEquals(
                2,
                result.get(0).getUnitsDonated()
        );


        assertEquals(
                3,
                result.get(1).getUnitsDonated()
        );


        verify(
                donationHistoryRepository,
                times(1)
        ).findAll();
    }


    // =====================================================
    // TEST 8
    // EMPTY DONATIONS
    // =====================================================

    @Test
    void shouldReturnEmptyDonations() {

        when(
                donationHistoryRepository.findAll()
        ).thenReturn(
                List.of()
        );


        List<DonationHistoryResponse> result =
                donationHistoryService
                        .getAllDonations();


        assertNotNull(result);


        assertTrue(
                result.isEmpty()
        );


        verify(
                donationHistoryRepository,
                times(1)
        ).findAll();
    }


    // =====================================================
    // TEST 9
    // GET ONE DONATION
    // =====================================================

    @Test
    void shouldGetDonation() {

        DonationHistory donation =
                new DonationHistory();

        donation.setId(donationId);

        donation.setDonor(donor);

        donation.setBloodRequest(
                bloodRequest
        );

        donation.setUnitsDonated(2);

        donation.setSuccessful(true);

        donation.setDonationDate(
                LocalDateTime.now()
        );


        when(
                donationHistoryRepository.findById(
                        donationId
                )
        ).thenReturn(
                Optional.of(donation)
        );


        DonationHistoryResponse response =
                donationHistoryService.getDonation(
                        donationId
                );


        assertNotNull(response);


        assertEquals(
                donationId,
                response.getDonationId()
        );


        assertEquals(
                donorId,
                response.getDonorId()
        );


        assertEquals(
                requestId,
                response.getRequestId()
        );


        assertEquals(
                2,
                response.getUnitsDonated()
        );


        assertTrue(
                response.getSuccessful()
        );


        verify(
                donationHistoryRepository,
                times(1)
        ).findById(donationId);
    }


    // =====================================================
    // TEST 10
    // DONATION NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenDonationDoesNotExist() {

        when(
                donationHistoryRepository.findById(
                        donationId
                )
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donationHistoryService.getDonation(
                                        donationId
                                )
                );


        assertEquals(
                "Donation Not Found",
                exception.getMessage()
        );
    }
}