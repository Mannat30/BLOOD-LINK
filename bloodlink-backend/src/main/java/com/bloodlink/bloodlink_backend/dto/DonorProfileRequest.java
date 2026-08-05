package com.bloodlink.bloodlink_backend.dto;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.Gender;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class DonorProfileRequest {

    private BloodGroup bloodGroup;

    private Gender gender;

    private LocalDate dateOfBirth;

    private Double weight;

    private LocalDate lastDonationDate;

    private Boolean available;

    private String city;

    private String state;

    private String pincode;

    private Double latitude;

    private Double longitude;
}