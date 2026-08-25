package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.AllocationStatus;
import com.bloodlink.bloodlink_backend.Enum.RequestStatus;
import com.bloodlink.bloodlink_backend.dto.BloodAllocationRequest;
import com.bloodlink.bloodlink_backend.dto.BloodAllocationResponse;
import com.bloodlink.bloodlink_backend.entity.BloodAllocation;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.DonationHistory;
import com.bloodlink.bloodlink_backend.repo.BloodAllocationRepository;
import com.bloodlink.bloodlink_backend.repo.BloodRequestRepository;
import com.bloodlink.bloodlink_backend.repo.DonationHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BloodAllocationServiceImpl
        implements BloodAllocationService {

    private final BloodAllocationRepository bloodAllocationRepository;
    private final DonationHistoryRepository donationHistoryRepository;
    private final BloodRequestRepository bloodRequestRepository;

    public BloodAllocationServiceImpl(
            BloodAllocationRepository bloodAllocationRepository,
            DonationHistoryRepository donationHistoryRepository,
            BloodRequestRepository bloodRequestRepository) {

        this.bloodAllocationRepository =
                bloodAllocationRepository;

        this.donationHistoryRepository =
                donationHistoryRepository;

        this.bloodRequestRepository =
                bloodRequestRepository;
    }

    // =====================================================
    // ALLOCATE BLOOD
    // =====================================================

    @Override
    @Transactional
    public BloodAllocationResponse allocateBlood(
            UUID donationId,
            BloodAllocationRequest request) {

        // =================================================
        // 1. FIND DONATION
        // =================================================

        DonationHistory donation =
                donationHistoryRepository
                        .findById(donationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Donation Not Found"
                                )
                        );

        // =================================================
        // 2. CHECK SUCCESSFUL DONATION
        // =================================================

        if (!Boolean.TRUE.equals(
                donation.getSuccessful())) {

            throw new RuntimeException(
                    "Only successful donations can be allocated"
            );
        }

        // =================================================
        // 3. VALIDATE REQUEST BODY
        // =================================================

        if (request == null ||
                request.getAllocatedUnits() == null) {

            throw new RuntimeException(
                    "Allocated units cannot be null"
            );
        }

        int allocatedUnits =
                request.getAllocatedUnits();

        if (allocatedUnits <= 0) {

            throw new RuntimeException(
                    "Allocated units must be greater than 0"
            );
        }

        // =================================================
        // 4. GET BLOOD REQUEST
        // =================================================

        BloodRequest bloodRequest =
                donation.getBloodRequest();

        if (bloodRequest == null) {

            throw new RuntimeException(
                    "Blood Request Not Found"
            );
        }

        // =================================================
        // 5. GET DONOR
        // =================================================

        var donor =
                donation.getDonor();

        if (donor == null) {

            throw new RuntimeException(
                    "Donor Not Found"
            );
        }

        // =================================================
        // 6. CHECK REQUEST STATUS
        // =================================================

        if (bloodRequest.getStatus() ==
                RequestStatus.COMPLETED) {

            throw new RuntimeException(
                    "Blood request is already completed"
            );
        }

        // =================================================
        // 7. DUPLICATE ALLOCATION CHECK
        // =================================================

        boolean alreadyAllocated =
                bloodAllocationRepository
                        .existsByBloodRequestIdAndDonorId(
                                bloodRequest.getId(),
                                donor.getId()
                        );

        if (alreadyAllocated) {

            throw new RuntimeException(
                    "Blood has already been allocated for this donor and request"
            );
        }

        // =================================================
        // 8. INITIALIZE FULFILLED UNITS
        // =================================================

        int fulfilledUnits =
                bloodRequest.getFulfilledUnits() == null
                        ? 0
                        : bloodRequest.getFulfilledUnits();

        // =================================================
        // 9. INITIALIZE REMAINING UNITS
        // =================================================

        int remainingUnits;

        if (bloodRequest.getRemainingUnits() == null) {

            remainingUnits =
                    bloodRequest.getUnitsRequired();

        } else {

            remainingUnits =
                    bloodRequest.getRemainingUnits();
        }

        // =================================================
        // 10. CHECK ALLOCATION LIMIT
        // =================================================

        if (allocatedUnits > remainingUnits) {

            throw new RuntimeException(
                    "Cannot allocate more units than remaining units. " +
                            "Remaining units: " +
                            remainingUnits
            );
        }

        // =================================================
        // 11. CALCULATE NEW VALUES
        // =================================================

        int newFulfilledUnits =
                fulfilledUnits + allocatedUnits;

        int newRemainingUnits =
                remainingUnits - allocatedUnits;

        // =================================================
        // 12. CREATE BLOOD ALLOCATION
        // =================================================

        BloodAllocation allocation =
                new BloodAllocation();

        allocation.setBloodRequest(
                bloodRequest
        );

        allocation.setDonor(
                donor
        );

        allocation.setHospital(
                bloodRequest.getHospital()
        );

        allocation.setAllocatedUnits(
                allocatedUnits
        );

        // =================================================
        // 13. UPDATE BLOOD REQUEST
        // =================================================

        bloodRequest.setFulfilledUnits(
                newFulfilledUnits
        );

        bloodRequest.setRemainingUnits(
                newRemainingUnits
        );

        // =================================================
        // 14. CHECK COMPLETION
        // =================================================

        if (newRemainingUnits == 0) {

            // Blood request completely fulfilled
            bloodRequest.setStatus(
                    RequestStatus.COMPLETED
            );

            allocation.setStatus(
                    AllocationStatus.COMPLETED
            );

            allocation.setCompletedAt(
                    LocalDateTime.now()
            );

        } else {

            // Blood request still needs blood
            allocation.setStatus(
                    AllocationStatus.ALLOCATED
            );
        }

        // =================================================
        // 15. SAVE BLOOD REQUEST
        // =================================================

        bloodRequestRepository.save(
                bloodRequest
        );

        // =================================================
        // 16. SAVE ALLOCATION
        // =================================================

        BloodAllocation savedAllocation =
                bloodAllocationRepository.save(
                        allocation
                );

        // =================================================
        // 17. RETURN RESPONSE
        // =================================================

        return new BloodAllocationResponse(

                savedAllocation.getId(),

                savedAllocation.getDonor().getId(),

                savedAllocation.getBloodRequest().getId(),

                savedAllocation.getHospital().getId(),

                savedAllocation.getAllocatedUnits(),

                savedAllocation.getStatus(),

                savedAllocation.getAllocatedAt()
        );
    }

    // =====================================================
    // GET ALL ALLOCATIONS
    // =====================================================

    @Override
    public List<BloodAllocationResponse>
    getAllAllocations() {

        return bloodAllocationRepository
                .findAll()
                .stream()
                .map(allocation ->

                        new BloodAllocationResponse(

                                allocation.getId(),

                                allocation.getDonor().getId(),

                                allocation.getBloodRequest().getId(),

                                allocation.getHospital().getId(),

                                allocation.getAllocatedUnits(),

                                allocation.getStatus(),

                                allocation.getAllocatedAt()
                        )

                )
                .toList();
    }

    // =====================================================
    // GET ALLOCATION BY ID
    // =====================================================

    @Override
    public BloodAllocationResponse
    getAllocation(UUID allocationId) {

        BloodAllocation allocation =
                bloodAllocationRepository
                        .findById(allocationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Allocation Not Found"
                                )
                        );

        return new BloodAllocationResponse(

                allocation.getId(),

                allocation.getDonor().getId(),

                allocation.getBloodRequest().getId(),

                allocation.getHospital().getId(),

                allocation.getAllocatedUnits(),

                allocation.getStatus(),

                allocation.getAllocatedAt()
        );
    }
}