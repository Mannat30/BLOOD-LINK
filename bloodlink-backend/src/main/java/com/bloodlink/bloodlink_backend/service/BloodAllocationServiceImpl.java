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

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BloodAllocationServiceImpl implements BloodAllocationService {

    private final BloodAllocationRepository bloodAllocationRepository;
    private final DonationHistoryRepository donationHistoryRepository;
    private final BloodRequestRepository bloodRequestRepository;

    public BloodAllocationServiceImpl(
            BloodAllocationRepository bloodAllocationRepository,
            DonationHistoryRepository donationHistoryRepository,
            BloodRequestRepository bloodRequestRepository) {

        this.bloodAllocationRepository = bloodAllocationRepository;
        this.donationHistoryRepository = donationHistoryRepository;
        this.bloodRequestRepository = bloodRequestRepository;
    }
    @Override
    public BloodAllocationResponse allocateBlood(
            UUID donationId,
            BloodAllocationRequest request) {

        DonationHistory donation =
                donationHistoryRepository.findById(donationId)
                        .orElseThrow(() ->
                                new RuntimeException("Donation Not Found"));

        if (request.getAllocatedUnits() == null) {
            throw new RuntimeException("Allocated units cannot be null");
        }

        if (request.getAllocatedUnits() <= 0) {
            throw new RuntimeException(
                    "Allocated units must be greater than 0");
        }

        BloodRequest bloodRequest = donation.getBloodRequest();

        // Check that we don't allocate more than required
        if (request.getAllocatedUnits()
                > bloodRequest.getRemainingUnits()) {

            throw new RuntimeException(
                    "Cannot allocate more units than remaining units");
        }

        // Create allocation
        BloodAllocation allocation = new BloodAllocation();

        allocation.setBloodRequest(bloodRequest);
        allocation.setDonor(donation.getDonor());
        allocation.setHospital(bloodRequest.getHospital());

        allocation.setAllocatedUnits(
                request.getAllocatedUnits());

        allocation.setStatus(
                AllocationStatus.ALLOCATED);

        BloodAllocation savedAllocation =
                bloodAllocationRepository.save(allocation);

        // ==============================
        // UPDATE BLOOD REQUEST
        // ==============================

        int allocatedUnits = request.getAllocatedUnits();

        int fulfilledUnits =
                bloodRequest.getFulfilledUnits() + allocatedUnits;

        int remainingUnits =
                bloodRequest.getRemainingUnits() - allocatedUnits;

        bloodRequest.setFulfilledUnits(fulfilledUnits);
        bloodRequest.setRemainingUnits(remainingUnits);

        // If nothing remains, request is fulfilled
        if (remainingUnits == 0) {

            bloodRequest.setStatus(
                    RequestStatus.FULFILLED);
        }

        // Save updated blood request
        bloodRequestRepository.save(bloodRequest);

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


    @Override
    public List<BloodAllocationResponse> getAllAllocations() {

        return bloodAllocationRepository.findAll()

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

                        ))

                .toList();
    }

    @Override
    public BloodAllocationResponse getAllocation(UUID allocationId) {

        BloodAllocation allocation = bloodAllocationRepository.findById(allocationId)

                .orElseThrow(() ->
                        new RuntimeException("Allocation Not Found"));

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