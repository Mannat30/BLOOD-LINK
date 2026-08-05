package com.bloodlink.bloodlink_backend.entity;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.Gender;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "donors")
@Getter
@Setter
public class Donor {

    @Id
    @UuidGenerator
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BloodGroup bloodGroup;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private Double weight;

    private LocalDate lastDonationDate;

    @Column(nullable = false)
    private Boolean available;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;
    private Double bloodLinkScore = 0.0;

    private Integer successfulDonations = 0;

    private Integer totalRequestsAccepted = 0;

    private Integer totalRequestsRejected = 0;
}