package com.bloodlink.bloodlink_backend.dto;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.RequestPriority;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class EmergencyAlert {

    private UUID requestId;

    private BloodGroup bloodGroup;

    private String hospitalName;

    private String city;

    private Integer unitsRequired;

    private RequestPriority priority;

    private Double distanceKm;
}