package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.EmergencyAlert;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class RealtimeNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public RealtimeNotificationService(
            SimpMessagingTemplate messagingTemplate) {

        this.messagingTemplate = messagingTemplate;
    }

    public void sendEmergencyAlert(
            UUID donorId,
            EmergencyAlert alert) {

        messagingTemplate.convertAndSend(
                "/topic/donor/" + donorId,
                alert
        );
    }
}