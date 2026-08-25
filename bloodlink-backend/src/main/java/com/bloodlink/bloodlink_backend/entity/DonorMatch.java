package com.bloodlink.bloodlink_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "donor_matches")
@Getter
@Setter
public class DonorMatch {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "blood_request_id", nullable = false)
    private BloodRequest bloodRequest;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    private Double distanceKm;

    private Double compatibilityScore;

    private Double availabilityScore;

    private Double donationHistoryScore;
    private Double reliabilityScore;

    private Double bloodLinkScore;

    private Double finalScore;

    private Integer rank;

    private Boolean notificationSent;

    private Boolean accepted;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime respondedAt;
}