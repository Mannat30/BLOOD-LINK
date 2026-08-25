package com.bloodlink.bloodlink_backend.repo;

import com.bloodlink.bloodlink_backend.entity.BloodAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BloodAllocationRepository
        extends JpaRepository<BloodAllocation, UUID> {

    boolean existsByBloodRequestIdAndDonorId(
            UUID bloodRequestId,
            UUID donorId
    );
}