package com.bloodlink.bloodlink_backend.dto;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.EmergencyType;
import com.bloodlink.bloodlink_backend.Enum.RequestPriority;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class BloodRequestDto {

    private UUID patientId;

    private UUID hospitalId;

    private BloodGroup bloodGroup;

    private Integer unitsRequired;

    private RequestPriority priority;

    private EmergencyType emergencyType;

    private String reason;

    private LocalDateTime requiredBefore;
}