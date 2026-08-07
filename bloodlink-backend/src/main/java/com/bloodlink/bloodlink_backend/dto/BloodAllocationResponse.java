package com.bloodlink.bloodlink_backend.dto;

import com.bloodlink.bloodlink_backend.Enum.AllocationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BloodAllocationResponse {

    private UUID allocationId;

    private UUID donorId;

    private UUID bloodRequestId;

    private UUID hospitalId;

    private Integer allocatedUnits;

    private AllocationStatus status;

    private LocalDateTime allocatedAt;
}