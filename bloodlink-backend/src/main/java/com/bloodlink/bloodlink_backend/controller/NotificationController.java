package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.entity.Notification;
import com.bloodlink.bloodlink_backend.repo.DonorMatchRepository;
import com.bloodlink.bloodlink_backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final DonorMatchRepository donorMatchRepository;

    public NotificationController(
            NotificationService notificationService,
            DonorMatchRepository donorMatchRepository) {

        this.notificationService = notificationService;
        this.donorMatchRepository = donorMatchRepository;
    }

    // =========================
    // SEND NOTIFICATION
    // =========================

    @PostMapping("/send/{donorMatchId}")
    public Notification sendNotification(
            @PathVariable UUID donorMatchId) {

        DonorMatch donorMatch =
                donorMatchRepository.findById(donorMatchId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Donor Match Not Found"
                                )
                        );

        return notificationService.sendNotification(donorMatch);
    }

    // =========================
    // GET ALL NOTIFICATIONS
    // =========================

    @GetMapping
    public List<Notification> getAllNotifications() {

        return notificationService.getAllNotifications();
    }

    // =========================
    // GET NOTIFICATION BY ID
    // =========================

    @GetMapping("/{id}")
    public Notification getNotification(
            @PathVariable UUID id) {

        return notificationService.getNotificationById(id);
    }

    // =========================
    // MARK AS READ
    // =========================

    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable UUID id) {

        return notificationService.markAsRead(id);
    }

    // =========================
    // ACCEPT REQUEST
    // =========================

    @PutMapping("/{id}/accept")
    public Notification acceptRequest(
            @PathVariable UUID id) {

        return notificationService.acceptRequest(id);
    }

    // =========================
    // REJECT REQUEST
    // =========================

    @PutMapping("/{id}/reject")
    public Notification rejectRequest(
            @PathVariable UUID id) {

        return notificationService.rejectRequest(id);
    }
}