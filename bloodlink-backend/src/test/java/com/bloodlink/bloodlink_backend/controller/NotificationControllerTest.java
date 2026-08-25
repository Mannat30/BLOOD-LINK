package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.entity.Notification;
import com.bloodlink.bloodlink_backend.repo.DonorMatchRepository;
import com.bloodlink.bloodlink_backend.service.NotificationService;

import jakarta.servlet.ServletException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationService notificationService;

    @Mock
    private DonorMatchRepository donorMatchRepository;

    @InjectMocks
    private NotificationController notificationController;

    private MockMvc mockMvc;

    private UUID donorMatchId;

    private UUID notificationId;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        mockMvc = MockMvcBuilders
                .standaloneSetup(notificationController)
                .build();

        donorMatchId = UUID.randomUUID();

        notificationId = UUID.randomUUID();
    }


    // =====================================================
    // TEST 1
    // SEND NOTIFICATION
    // =====================================================

    @Test
    void shouldSendNotification()
            throws Exception {

        DonorMatch donorMatch =
                mock(DonorMatch.class);

        Notification notification =
                mock(Notification.class);


        when(
                donorMatchRepository.findById(
                        donorMatchId
                )
        ).thenReturn(
                Optional.of(donorMatch)
        );


        when(
                notificationService.sendNotification(
                        donorMatch
                )
        ).thenReturn(notification);


        mockMvc.perform(
                        post(
                                "/api/notifications/send/{donorMatchId}",
                                donorMatchId
                        )
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                donorMatchRepository,
                times(1)
        ).findById(donorMatchId);


        verify(
                notificationService,
                times(1)
        ).sendNotification(donorMatch);
    }


    // =====================================================
    // TEST 2
    // GET ALL NOTIFICATIONS
    // =====================================================

    @Test
    void shouldGetAllNotifications()
            throws Exception {

        Notification notification1 =
                mock(Notification.class);

        Notification notification2 =
                mock(Notification.class);


        when(
                notificationService.getAllNotifications()
        ).thenReturn(
                List.of(
                        notification1,
                        notification2
                )
        );


        mockMvc.perform(
                        get("/api/notifications")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.length()")
                                .value(2)
                );


        verify(
                notificationService,
                times(1)
        ).getAllNotifications();
    }


    // =====================================================
    // TEST 3
    // EMPTY NOTIFICATION LIST
    // =====================================================

    @Test
    void shouldReturnEmptyNotificationList()
            throws Exception {

        when(
                notificationService.getAllNotifications()
        ).thenReturn(
                List.of()
        );


        mockMvc.perform(
                        get("/api/notifications")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.length()")
                                .value(0)
                );


        verify(
                notificationService,
                times(1)
        ).getAllNotifications();
    }


    // =====================================================
    // TEST 4
    // GET NOTIFICATION BY ID
    // =====================================================

    @Test
    void shouldGetNotificationById()
            throws Exception {

        Notification notification =
                mock(Notification.class);


        when(
                notificationService.getNotificationById(
                        notificationId
                )
        ).thenReturn(notification);


        mockMvc.perform(
                        get(
                                "/api/notifications/{id}",
                                notificationId
                        )
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                notificationService,
                times(1)
        ).getNotificationById(notificationId);
    }


    // =====================================================
    // TEST 5
    // MARK AS READ
    // =====================================================

    @Test
    void shouldMarkNotificationAsRead()
            throws Exception {

        Notification notification =
                mock(Notification.class);


        when(
                notificationService.markAsRead(
                        notificationId
                )
        ).thenReturn(notification);


        mockMvc.perform(
                        put(
                                "/api/notifications/{id}/read",
                                notificationId
                        )
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                notificationService,
                times(1)
        ).markAsRead(notificationId);
    }


    // =====================================================
    // TEST 6
    // ACCEPT REQUEST
    // =====================================================

    @Test
    void shouldAcceptRequest()
            throws Exception {

        Notification notification =
                mock(Notification.class);


        when(
                notificationService.acceptRequest(
                        notificationId
                )
        ).thenReturn(notification);


        mockMvc.perform(
                        put(
                                "/api/notifications/{id}/accept",
                                notificationId
                        )
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                notificationService,
                times(1)
        ).acceptRequest(notificationId);
    }


    // =====================================================
    // TEST 7
    // REJECT REQUEST
    // =====================================================

    @Test
    void shouldRejectRequest()
            throws Exception {

        Notification notification =
                mock(Notification.class);


        when(
                notificationService.rejectRequest(
                        notificationId
                )
        ).thenReturn(notification);


        mockMvc.perform(
                        put(
                                "/api/notifications/{id}/reject",
                                notificationId
                        )
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                notificationService,
                times(1)
        ).rejectRequest(notificationId);
    }


    // =====================================================
    // TEST 8
    // DONOR MATCH NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenDonorMatchNotFound() {

        when(
                donorMatchRepository.findById(
                        donorMatchId
                )
        ).thenReturn(
                Optional.empty()
        );


        ServletException exception =
                assertThrows(
                        ServletException.class,
                        () -> mockMvc.perform(
                                post(
                                        "/api/notifications/send/{donorMatchId}",
                                        donorMatchId
                                )
                        )
                );


        // Check actual cause
        assert exception.getCause()
                instanceof RuntimeException;


        // Check exception message
        assert exception.getCause()
                .getMessage()
                .equals("Donor Match Not Found");


        verify(
                donorMatchRepository,
                times(1)
        ).findById(donorMatchId);


        verify(
                notificationService,
                never()
        ).sendNotification(
                any(DonorMatch.class)
        );
    }
}