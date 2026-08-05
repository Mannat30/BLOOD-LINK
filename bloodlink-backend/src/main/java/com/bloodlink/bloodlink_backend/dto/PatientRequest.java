package com.bloodlink.bloodlink_backend.dto;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.Gender;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PatientRequest {

    private BloodGroup bloodGroup;

    private Gender gender;

    private LocalDate dateOfBirth;

    private String medicalCondition;

    private Boolean emergencyContactAvailable;

}