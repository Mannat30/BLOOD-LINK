package com.bloodlink.bloodlink_backend.dto;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DonorResponse {

    // =========================
    // DONOR ID
    // =========================

    private UUID id;


    // =========================
    // USER INFORMATION
    // =========================

    private String name;

    private String email;

    private String phoneNumber;

    private String role;


    // =========================
    // DONOR INFORMATION
    // =========================

    private BloodGroup bloodGroup;

    private Gender gender;

    private LocalDate dateOfBirth;

    private Double weight;


    // =========================
    // LOCATION
    // =========================

    private String city;

    private String state;

    private String pincode;

    private Double latitude;

    private Double longitude;


    // =========================
    // AVAILABILITY
    // =========================

    private Boolean available;


    // =========================
    // DONATION STATISTICS
    // =========================

    private Integer successfulDonations;

    private Integer totalRequestsAccepted;

    private Integer totalRequestsRejected;
}