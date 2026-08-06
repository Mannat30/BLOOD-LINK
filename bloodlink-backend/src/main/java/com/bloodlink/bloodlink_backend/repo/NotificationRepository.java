package com.bloodlink.bloodlink_backend.repo;

import com.bloodlink.bloodlink_backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificationRepository
        extends JpaRepository<Notification, UUID> {
}