package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.entity.Notification;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    Notification sendNotification(DonorMatch donorMatch);

    List<Notification> getAllNotifications();

    Notification getNotificationById(UUID id);

    Notification markAsRead(UUID id);

    Notification acceptRequest(UUID id);

    Notification rejectRequest(UUID id);
}