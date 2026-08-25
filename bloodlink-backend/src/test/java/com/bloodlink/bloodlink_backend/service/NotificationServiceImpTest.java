package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.NotificationStatus;
import com.bloodlink.bloodlink_backend.Enum.RequestPriority;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.entity.Hospital;
import com.bloodlink.bloodlink_backend.entity.Notification;
import com.bloodlink.bloodlink_backend.repo.DonorMatchRepository;
import com.bloodlink.bloodlink_backend.repo.NotificationRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class NotificationServiceImplTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private DonorMatchRepository donorMatchRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private DonorMatch donorMatch;
    private BloodRequest bloodRequest;
    private Hospital hospital;
    private Notification notification;

    private UUID notificationId;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        notificationId = UUID.randomUUID();


        // =========================
        // HOSPITAL
        // =========================

        hospital = new Hospital();

        hospital.setHospitalName(
                "City Hospital"
        );


        // =========================
        // BLOOD REQUEST
        // =========================

        bloodRequest = new BloodRequest();

        bloodRequest.setBloodGroup(
                BloodGroup.A_POSITIVE
        );

        bloodRequest.setHospital(
                hospital
        );

        bloodRequest.setUnitsRequired(
                2
        );

        bloodRequest.setPriority(
                RequestPriority.HIGH
        );


        // =========================
        // DONOR MATCH
        // =========================

        donorMatch = new DonorMatch();

        donorMatch.setBloodRequest(
                bloodRequest
        );

        donorMatch.setNotificationSent(
                false
        );

        donorMatch.setAccepted(
                false
        );


        // =========================
        // NOTIFICATION
        // =========================

        notification = new Notification();

        notification.setDonorMatch(
                donorMatch
        );

        notification.setTitle(
                "Blood Donation Request"
        );

        notification.setStatus(
                NotificationStatus.SENT
        );
    }


    // =====================================================
    // TEST 1
    // SEND NOTIFICATION
    // =====================================================

    @Test
    void shouldSendNotification() {

        when(
                notificationRepository.save(
                        any(Notification.class)
                )
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        when(
                donorMatchRepository.save(
                        any(DonorMatch.class)
                )
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        Notification result =
                notificationService.sendNotification(
                        donorMatch
                );


        assertNotNull(result);


        assertEquals(
                "Blood Donation Request",
                result.getTitle()
        );


        assertEquals(
                NotificationStatus.SENT,
                result.getStatus()
        );


        assertNotNull(
                result.getMessage()
        );


        assertTrue(
                result.getMessage()
                        .contains("A_POSITIVE")
        );


        assertTrue(
                result.getMessage()
                        .contains("City Hospital")
        );


        assertTrue(
                result.getMessage()
                        .contains("2")
        );


        assertTrue(
                donorMatch.getNotificationSent()
        );


        verify(
                notificationRepository,
                times(1)
        ).save(any(Notification.class));


        verify(
                donorMatchRepository,
                times(1)
        ).save(donorMatch);
    }


    // =====================================================
    // TEST 2
    // GET ALL NOTIFICATIONS
    // =====================================================

    @Test
    void shouldGetAllNotifications() {

        Notification notification1 =
                new Notification();

        Notification notification2 =
                new Notification();


        when(
                notificationRepository.findAll()
        ).thenReturn(
                List.of(
                        notification1,
                        notification2
                )
        );


        List<Notification> result =
                notificationService.getAllNotifications();


        assertNotNull(result);


        assertEquals(
                2,
                result.size()
        );


        verify(
                notificationRepository,
                times(1)
        ).findAll();
    }


    // =====================================================
    // TEST 3
    // GET NOTIFICATION BY ID
    // =====================================================

    @Test
    void shouldGetNotificationById() {

        when(
                notificationRepository.findById(
                        notificationId
                )
        ).thenReturn(
                Optional.of(notification)
        );


        Notification result =
                notificationService.getNotificationById(
                        notificationId
                );


        assertNotNull(result);


        assertSame(
                notification,
                result
        );


        verify(
                notificationRepository,
                times(1)
        ).findById(notificationId);
    }


    // =====================================================
    // TEST 4
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
                                notificationService
                                        .getNotificationById(
                                                notificationId
                                        )
                );


        assertEquals(
                "Notification Not Found",
                exception.getMessage()
        );
    }


    // =====================================================
    // TEST 5
    // MARK AS READ
    // =====================================================

    @Test
    void shouldMarkNotificationAsRead() {

        notification.setStatus(
                NotificationStatus.SENT
        );


        when(
                notificationRepository.findById(
                        notificationId
                )
        ).thenReturn(
                Optional.of(notification)
        );


        when(
                notificationRepository.save(
                        any(Notification.class)
                )
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        Notification result =
                notificationService.markAsRead(
                        notificationId
                );


        assertNotNull(result);


        assertEquals(
                NotificationStatus.READ,
                result.getStatus()
        );


        assertNotNull(
                result.getReadAt()
        );


        verify(
                notificationRepository,
                times(1)
        ).findById(notificationId);


        verify(
                notificationRepository,
                times(1)
        ).save(notification);
    }


    // =====================================================
    // TEST 6
    // ACCEPT REQUEST
    // =====================================================

    @Test
    void shouldAcceptRequest() {

        notification.setStatus(
                NotificationStatus.SENT
        );

        donorMatch.setAccepted(false);


        when(
                notificationRepository.findById(
                        notificationId
                )
        ).thenReturn(
                Optional.of(notification)
        );


        when(
                donorMatchRepository.save(
                        any(DonorMatch.class)
                )
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        when(
                notificationRepository.save(
                        any(Notification.class)
                )
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        Notification result =
                notificationService.acceptRequest(
                        notificationId
                );


        assertNotNull(result);


        assertEquals(
                NotificationStatus.ACCEPTED,
                result.getStatus()
        );


        assertTrue(
                donorMatch.getAccepted()
        );


        assertNotNull(
                donorMatch.getRespondedAt()
        );


        verify(
                donorMatchRepository,
                times(1)
        ).save(donorMatch);


        verify(
                notificationRepository,
                times(1)
        ).save(notification);
    }


    // =====================================================
    // TEST 7
    // ACCEPT REQUEST - NOT FOUND
    // =====================================================

    @Test
    void shouldRejectAcceptWhenNotificationDoesNotExist() {

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
                                notificationService
                                        .acceptRequest(
                                                notificationId
                                        )
                );


        assertEquals(
                "Notification Not Found",
                exception.getMessage()
        );


        verify(
                donorMatchRepository,
                never()
        ).save(any(DonorMatch.class));


        verify(
                notificationRepository,
                never()
        ).save(any(Notification.class));
    }


    // =====================================================
    // TEST 8
    // REJECT REQUEST
    // =====================================================

    @Test
    void shouldRejectRequest() {

        notification.setStatus(
                NotificationStatus.SENT
        );

        donorMatch.setAccepted(true);


        when(
                notificationRepository.findById(
                        notificationId
                )
        ).thenReturn(
                Optional.of(notification)
        );


        when(
                donorMatchRepository.save(
                        any(DonorMatch.class)
                )
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        when(
                notificationRepository.save(
                        any(Notification.class)
                )
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        Notification result =
                notificationService.rejectRequest(
                        notificationId
                );


        assertNotNull(result);


        assertEquals(
                NotificationStatus.REJECTED,
                result.getStatus()
        );


        assertFalse(
                donorMatch.getAccepted()
        );


        assertNotNull(
                donorMatch.getRespondedAt()
        );


        verify(
                donorMatchRepository,
                times(1)
        ).save(donorMatch);


        verify(
                notificationRepository,
                times(1)
        ).save(notification);
    }


    // =====================================================
    // TEST 9
    // REJECT REQUEST - NOT FOUND
    // =====================================================

    @Test
    void shouldRejectRejectWhenNotificationDoesNotExist() {

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
                                notificationService
                                        .rejectRequest(
                                                notificationId
                                        )
                );


        assertEquals(
                "Notification Not Found",
                exception.getMessage()
        );


        verify(
                donorMatchRepository,
                never()
        ).save(any(DonorMatch.class));


        verify(
                notificationRepository,
                never()
        ).save(any(Notification.class));
    }


    // =====================================================
    // TEST 10
    // EMPTY NOTIFICATION LIST
    // =====================================================

    @Test
    void shouldReturnEmptyNotificationList() {

        when(
                notificationRepository.findAll()
        ).thenReturn(
                List.of()
        );


        List<Notification> result =
                notificationService.getAllNotifications();


        assertNotNull(result);


        assertTrue(
                result.isEmpty()
        );


        verify(
                notificationRepository,
                times(1)
        ).findAll();
    }
}