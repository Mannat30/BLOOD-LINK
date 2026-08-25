package com.bloodlink.bloodlink_backend.dto;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.EmergencyType;
import com.bloodlink.bloodlink_backend.Enum.RequestPriority;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class BloodRequestDto {

    @NotNull
    private UUID patientId;

    @NotNull
    private UUID hospitalId;

    @NotNull
    private BloodGroup bloodGroup;

    @Min(value = 1)
    private Integer unitsRequired;

    @NotNull
    private EmergencyType emergencyType;

    @NotNull
    private RequestPriority priority;

    @NotBlank
    private String reason;

    @NotNull
    private LocalDateTime requiredBefore;
}