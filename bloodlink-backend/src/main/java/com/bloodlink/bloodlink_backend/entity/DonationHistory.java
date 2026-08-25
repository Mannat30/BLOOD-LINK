package com.bloodlink.bloodlink_backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "donation_history")
@Getter
@Setter
public class DonationHistory {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @ManyToOne
    @JoinColumn(name = "blood_request_id", nullable = false)
    private BloodRequest bloodRequest;

    @Column(nullable = false)
    private Integer unitsDonated;

    @CreationTimestamp
    private LocalDateTime donationDate;

    @Column(nullable = false)
    private Boolean successful;
}