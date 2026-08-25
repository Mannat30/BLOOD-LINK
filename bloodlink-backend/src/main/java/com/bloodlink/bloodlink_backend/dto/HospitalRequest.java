package com.bloodlink.bloodlink_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HospitalRequest {

    @NotBlank
    private String hospitalName;

    @NotBlank
    private String registrationNumber;

    @NotBlank
    private String contactPerson;

    @Pattern(regexp = "^[6-9]\\d{9}$")
    private String contactPhone;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String pincode;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;
}