package com.bloodlink.bloodlink_backend.dto;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PatientRequest {

    @NotBlank
    private String patientName;

    @NotNull
    private Integer age;

    @NotNull
    private BloodGroup bloodGroup;

    @NotBlank
    private String disease;

    @NotBlank
    private String city;
}