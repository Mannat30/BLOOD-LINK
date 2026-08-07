package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.BloodAllocationRequest;
import com.bloodlink.bloodlink_backend.dto.BloodAllocationResponse;

import java.util.List;
import java.util.UUID;

public interface BloodAllocationService {

    BloodAllocationResponse allocateBlood(
            UUID donationId,
            BloodAllocationRequest request);

    List<BloodAllocationResponse> getAllAllocations();

    BloodAllocationResponse getAllocation(UUID allocationId);
}