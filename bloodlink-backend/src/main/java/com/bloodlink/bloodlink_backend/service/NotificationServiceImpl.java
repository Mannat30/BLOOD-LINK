package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.NotificationStatus;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.entity.Notification;
import com.bloodlink.bloodlink_backend.repo.DonorMatchRepository;
import com.bloodlink.bloodlink_backend.repo.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final DonorMatchRepository donorMatchRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   DonorMatchRepository donorMatchRepository) {
        this.notificationRepository = notificationRepository;
        this.donorMatchRepository = donorMatchRepository;
    }

    @Override
    public Notification sendNotification(DonorMatch donorMatch) {

        Notification notification = new Notification();

        notification.setDonorMatch(donorMatch);

        notification.setTitle("Blood Donation Request");

        notification.setMessage(
                "Urgent Blood Request\n\n" +
                        "Blood Group : " + donorMatch.getBloodRequest().getBloodGroup() + "\n" +
                        "Hospital    : " + donorMatch.getBloodRequest().getHospital().getHospitalName() + "\n" +
                        "Units Needed: " + donorMatch.getBloodRequest().getUnitsRequired() + "\n" +
                        "Priority    : " + donorMatch.getBloodRequest().getPriority()
        );

        notification.setStatus(NotificationStatus.SENT);

        Notification savedNotification = notificationRepository.save(notification);

        donorMatch.setNotificationSent(true);
        donorMatchRepository.save(donorMatch);

        return savedNotification;
    }

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public Notification getNotificationById(UUID id) {

        return notificationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notification Not Found"));
    }

    @Override
    public Notification markAsRead(UUID id) {

        Notification notification = getNotificationById(id);

        notification.setStatus(NotificationStatus.READ);

        notification.setReadAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    @Override
    public Notification acceptRequest(UUID id) {

        Notification notification = getNotificationById(id);

        notification.setStatus(NotificationStatus.ACCEPTED);

        notification.getDonorMatch().setAccepted(true);

        notification.getDonorMatch().setRespondedAt(LocalDateTime.now());

        donorMatchRepository.save(notification.getDonorMatch());

        return notificationRepository.save(notification);
    }

    @Override
    public Notification rejectRequest(UUID id) {

        Notification notification = getNotificationById(id);

        notification.setStatus(NotificationStatus.REJECTED);

        notification.getDonorMatch().setAccepted(false);

        notification.getDonorMatch().setRespondedAt(LocalDateTime.now());

        donorMatchRepository.save(notification.getDonorMatch());

        return notificationRepository.save(notification);
    }
}