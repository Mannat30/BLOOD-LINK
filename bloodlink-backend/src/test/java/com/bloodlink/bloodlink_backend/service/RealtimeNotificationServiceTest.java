package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.RequestPriority;
import com.bloodlink.bloodlink_backend.dto.EmergencyAlert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RealtimeNotificationServiceTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    private RealtimeNotificationService service;

    @BeforeEach
    void setUp() {
        service =
                new RealtimeNotificationService(
                        messagingTemplate
                );
    }

    // =====================================================
    // TEST 1
    // SHOULD SEND ALERT TO CORRECT DONOR
    // =====================================================

    @Test
    void shouldSendEmergencyAlertToCorrectDonor() {

        UUID donorId = UUID.randomUUID();
        UUID requestId = UUID.randomUUID();

        EmergencyAlert alert =
                new EmergencyAlert(
                        requestId,
                        BloodGroup.O_NEGATIVE,
                        "City Hospital",
                        "Jaipur",
                        2,
                        RequestPriority.CRITICAL,
                        4.5
                );

        service.sendEmergencyAlert(
                donorId,
                alert
        );

        verify(messagingTemplate)
                .convertAndSend(
                        "/topic/donor/" + donorId,
                        alert
                );
    }

    // =====================================================
    // TEST 2
    // SHOULD SEND EXACT ALERT OBJECT
    // =====================================================

    @Test
    void shouldSendCorrectAlertObject() {

        UUID donorId = UUID.randomUUID();

        EmergencyAlert alert =
                new EmergencyAlert(
                        UUID.randomUUID(),
                        BloodGroup.A_POSITIVE,
                        "BloodLink Hospital",
                        "Jaipur",
                        3,
                        RequestPriority.CRITICAL,
                        7.2
                );

        service.sendEmergencyAlert(
                donorId,
                alert
        );

        ArgumentCaptor<String> topicCaptor =
                ArgumentCaptor.forClass(String.class);

        ArgumentCaptor<EmergencyAlert> alertCaptor =
                ArgumentCaptor.forClass(
                        EmergencyAlert.class
                );

        verify(messagingTemplate)
                .convertAndSend(
                        topicCaptor.capture(),
                        alertCaptor.capture()
                );

        assertEquals(
                "/topic/donor/" + donorId,
                topicCaptor.getValue()
        );

        assertEquals(
                alert,
                alertCaptor.getValue()
        );
    }

    // =====================================================
    // TEST 3
    // SHOULD SEND ONLY ONCE
    // =====================================================

    @Test
    void shouldSendAlertOnlyOnce() {

        UUID donorId = UUID.randomUUID();

        EmergencyAlert alert =
                new EmergencyAlert(
                        UUID.randomUUID(),
                        BloodGroup.B_POSITIVE,
                        "City Hospital",
                        "Jaipur",
                        1,
                        RequestPriority.CRITICAL,
                        3.0
                );

        service.sendEmergencyAlert(
                donorId,
                alert
        );

        verify(
                messagingTemplate,
                times(1)
        ).convertAndSend(
                "/topic/donor/" + donorId,
                alert
        );
    }

    // =====================================================
    // TEST 4
    // DIFFERENT DONORS GET DIFFERENT TOPICS
    // =====================================================

    @Test
    void shouldSendAlertToCorrectDonorTopic() {

        UUID donor1 = UUID.randomUUID();
        UUID donor2 = UUID.randomUUID();

        EmergencyAlert alert =
                new EmergencyAlert(
                        UUID.randomUUID(),
                        BloodGroup.O_NEGATIVE,
                        "Emergency Hospital",
                        "Jaipur",
                        2,
                        RequestPriority.CRITICAL,
                        5.0
                );

        service.sendEmergencyAlert(
                donor1,
                alert
        );

        service.sendEmergencyAlert(
                donor2,
                alert
        );

        verify(messagingTemplate)
                .convertAndSend(
                        "/topic/donor/" + donor1,
                        alert
                );

        verify(messagingTemplate)
                .convertAndSend(
                        "/topic/donor/" + donor2,
                        alert
                );

        verify(
                messagingTemplate,
                times(2)
        ).convertAndSend(
                anyString(),
                eq(alert)
        );
    }
}