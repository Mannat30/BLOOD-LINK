package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.AllocationStatus;
import com.bloodlink.bloodlink_backend.Enum.RequestStatus;
import com.bloodlink.bloodlink_backend.dto.BloodAllocationRequest;
import com.bloodlink.bloodlink_backend.dto.BloodAllocationResponse;
import com.bloodlink.bloodlink_backend.entity.BloodAllocation;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.DonationHistory;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.Hospital;
import com.bloodlink.bloodlink_backend.repo.BloodAllocationRepository;
import com.bloodlink.bloodlink_backend.repo.BloodRequestRepository;
import com.bloodlink.bloodlink_backend.repo.DonationHistoryRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BloodAllocationServiceImplTest {

    @Mock
    private BloodAllocationRepository bloodAllocationRepository;

    @Mock
    private DonationHistoryRepository donationHistoryRepository;

    @Mock
    private BloodRequestRepository bloodRequestRepository;

    @InjectMocks
    private BloodAllocationServiceImpl bloodAllocationService;

    private UUID donationId;
    private UUID allocationId;
    private UUID donorId;
    private UUID requestId;
    private UUID hospitalId;

    private Donor donor;
    private Hospital hospital;
    private BloodRequest bloodRequest;
    private DonationHistory donation;
    private BloodAllocationRequest request;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        donationId = UUID.randomUUID();
        allocationId = UUID.randomUUID();
        donorId = UUID.randomUUID();
        requestId = UUID.randomUUID();
        hospitalId = UUID.randomUUID();


        // =========================
        // DONOR
        // =========================

        donor = new Donor();

        donor.setId(donorId);


        // =========================
        // HOSPITAL
        // =========================

        hospital = new Hospital();

        hospital.setId(hospitalId);


        // =========================
        // BLOOD REQUEST
        // =========================

        bloodRequest = new BloodRequest();

        bloodRequest.setId(requestId);

        bloodRequest.setHospital(hospital);

        bloodRequest.setFulfilledUnits(0);

        bloodRequest.setRemainingUnits(5);

        bloodRequest.setStatus(
                RequestStatus.PENDING
        );


        // =========================
        // DONATION
        // =========================

        donation = new DonationHistory();

        donation.setId(donationId);

        donation.setDonor(donor);

        donation.setBloodRequest(
                bloodRequest
        );

        // Allocation is allowed only for
        // successful donations.
        donation.setSuccessful(true);


        // =========================
        // ALLOCATION REQUEST
        // =========================

        request = new BloodAllocationRequest();

        request.setAllocatedUnits(2);
    }


    // =====================================================
    // TEST 1
    // SUCCESSFUL ALLOCATION
    // =====================================================

    @Test
    void shouldAllocateBlood() {

        when(
                donationHistoryRepository.findById(
                        donationId
                )
        ).thenReturn(
                Optional.of(donation)
        );


        when(
                bloodAllocationRepository.save(
                        any(BloodAllocation.class)
                )
        ).thenAnswer(invocation -> {

            BloodAllocation allocation =
                    invocation.getArgument(0);

            allocation.setId(allocationId);

            allocation.setAllocatedAt(
                    LocalDateTime.now()
            );

            return allocation;
        });


        BloodAllocationResponse response =
                bloodAllocationService.allocateBlood(
                        donationId,
                        request
                );


        assertNotNull(response);


        assertEquals(
                allocationId,
                response.getAllocationId()
        );


        assertEquals(
                donorId,
                response.getDonorId()
        );


        assertEquals(
                requestId,
                response.getBloodRequestId()
        );


        assertEquals(
                hospitalId,
                response.getHospitalId()
        );


        assertEquals(
                2,
                response.getAllocatedUnits()
        );


        assertEquals(
                AllocationStatus.ALLOCATED,
                response.getStatus()
        );


        assertNotNull(
                response.getAllocatedAt()
        );


        assertEquals(
                2,
                bloodRequest.getFulfilledUnits()
        );


        assertEquals(
                3,
                bloodRequest.getRemainingUnits()
        );


        assertEquals(
                RequestStatus.PENDING,
                bloodRequest.getStatus()
        );


        verify(
                donationHistoryRepository,
                times(1)
        ).findById(donationId);


        verify(
                bloodAllocationRepository,
                times(1)
        ).save(any(BloodAllocation.class));


        verify(
                bloodRequestRepository,
                times(1)
        ).save(bloodRequest);
    }


    // =====================================================
    // TEST 2
    // DONATION NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenDonationDoesNotExist() {

        when(
                donationHistoryRepository.findById(
                        donationId
                )
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodAllocationService
                                        .allocateBlood(
                                                donationId,
                                                request
                                        )
                );


        assertEquals(
                "Donation Not Found",
                exception.getMessage()
        );


        verify(
                bloodAllocationRepository,
                never()
        ).save(any(BloodAllocation.class));


        verify(
                bloodRequestRepository,
                never()
        ).save(any(BloodRequest.class));
    }


    // =====================================================
    // TEST 3
    // NULL ALLOCATED UNITS
    // =====================================================

    @Test
    void shouldRejectNullAllocatedUnits() {

        request.setAllocatedUnits(null);


        when(
                donationHistoryRepository.findById(
                        donationId
                )
        ).thenReturn(
                Optional.of(donation)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodAllocationService
                                        .allocateBlood(
                                                donationId,
                                                request
                                        )
                );


        assertEquals(
                "Allocated units cannot be null",
                exception.getMessage()
        );


        verify(
                bloodAllocationRepository,
                never()
        ).save(any(BloodAllocation.class));


        verify(
                bloodRequestRepository,
                never()
        ).save(any(BloodRequest.class));
    }


    // =====================================================
    // TEST 4
    // ZERO ALLOCATED UNITS
    // =====================================================

    @Test
    void shouldRejectZeroAllocatedUnits() {

        request.setAllocatedUnits(0);


        when(
                donationHistoryRepository.findById(
                        donationId
                )
        ).thenReturn(
                Optional.of(donation)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodAllocationService
                                        .allocateBlood(
                                                donationId,
                                                request
                                        )
                );


        assertEquals(
                "Allocated units must be greater than 0",
                exception.getMessage()
        );


        verify(
                bloodAllocationRepository,
                never()
        ).save(any(BloodAllocation.class));


        verify(
                bloodRequestRepository,
                never()
        ).save(any(BloodRequest.class));
    }


    // =====================================================
    // TEST 5
    // NEGATIVE ALLOCATED UNITS
    // =====================================================

    @Test
    void shouldRejectNegativeAllocatedUnits() {

        request.setAllocatedUnits(-2);


        when(
                donationHistoryRepository.findById(
                        donationId
                )
        ).thenReturn(
                Optional.of(donation)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodAllocationService
                                        .allocateBlood(
                                                donationId,
                                                request
                                        )
                );


        assertEquals(
                "Allocated units must be greater than 0",
                exception.getMessage()
        );


        verify(
                bloodAllocationRepository,
                never()
        ).save(any(BloodAllocation.class));


        verify(
                bloodRequestRepository,
                never()
        ).save(any(BloodRequest.class));
    }


    // =====================================================
    // TEST 6
    // MORE THAN REMAINING UNITS
    // =====================================================

    @Test
    void shouldRejectMoreThanRemainingUnits() {

        request.setAllocatedUnits(6);


        when(
                donationHistoryRepository.findById(
                        donationId
                )
        ).thenReturn(
                Optional.of(donation)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodAllocationService
                                        .allocateBlood(
                                                donationId,
                                                request
                                        )
                );


        // FIXED EXPECTED MESSAGE
        assertEquals(
                "Cannot allocate more units than remaining units. Remaining units: 5",
                exception.getMessage()
        );


        verify(
                bloodAllocationRepository,
                never()
        ).save(any(BloodAllocation.class));


        verify(
                bloodRequestRepository,
                never()
        ).save(any(BloodRequest.class));
    }


    // =====================================================
    // TEST 7
    // FULL ALLOCATION
    // =====================================================

    @Test
    void shouldCompleteRequestWhenAllUnitsAreAllocated() {

        bloodRequest.setRemainingUnits(2);

        bloodRequest.setFulfilledUnits(0);

        request.setAllocatedUnits(2);


        when(
                donationHistoryRepository.findById(
                        donationId
                )
        ).thenReturn(
                Optional.of(donation)
        );


        when(
                bloodAllocationRepository.save(
                        any(BloodAllocation.class)
                )
        ).thenAnswer(invocation -> {

            BloodAllocation allocation =
                    invocation.getArgument(0);

            allocation.setId(allocationId);

            allocation.setAllocatedAt(
                    LocalDateTime.now()
            );

            return allocation;
        });


        BloodAllocationResponse response =
                bloodAllocationService.allocateBlood(
                        donationId,
                        request
                );


        assertNotNull(response);


        assertEquals(
                2,
                bloodRequest.getFulfilledUnits()
        );


        assertEquals(
                0,
                bloodRequest.getRemainingUnits()
        );


        assertEquals(
                RequestStatus.COMPLETED,
                bloodRequest.getStatus()
        );


        verify(
                bloodRequestRepository,
                times(1)
        ).save(bloodRequest);
    }


    // =====================================================
    // TEST 8
    // GET ALL ALLOCATIONS
    // =====================================================

    @Test
    void shouldGetAllAllocations() {

        BloodAllocation allocation1 =
                createAllocation(2);

        BloodAllocation allocation2 =
                createAllocation(3);


        when(
                bloodAllocationRepository.findAll()
        ).thenReturn(
                List.of(
                        allocation1,
                        allocation2
                )
        );


        List<BloodAllocationResponse> result =
                bloodAllocationService
                        .getAllAllocations();


        assertNotNull(result);


        assertEquals(
                2,
                result.size()
        );


        assertEquals(
                2,
                result.get(0).getAllocatedUnits()
        );


        assertEquals(
                3,
                result.get(1).getAllocatedUnits()
        );


        verify(
                bloodAllocationRepository,
                times(1)
        ).findAll();
    }


    // =====================================================
    // TEST 9
    // EMPTY ALLOCATION LIST
    // =====================================================

    @Test
    void shouldReturnEmptyAllocationList() {

        when(
                bloodAllocationRepository.findAll()
        ).thenReturn(
                List.of()
        );


        List<BloodAllocationResponse> result =
                bloodAllocationService
                        .getAllAllocations();


        assertNotNull(result);


        assertTrue(
                result.isEmpty()
        );


        verify(
                bloodAllocationRepository,
                times(1)
        ).findAll();
    }


    // =====================================================
    // TEST 10
    // GET ONE ALLOCATION
    // =====================================================

    @Test
    void shouldGetOneAllocation() {

        BloodAllocation allocation =
                createAllocation(2);

        allocation.setId(
                allocationId
        );


        when(
                bloodAllocationRepository.findById(
                        allocationId
                )
        ).thenReturn(
                Optional.of(allocation)
        );


        BloodAllocationResponse response =
                bloodAllocationService.getAllocation(
                        allocationId
                );


        assertNotNull(response);


        assertEquals(
                allocationId,
                response.getAllocationId()
        );


        assertEquals(
                donorId,
                response.getDonorId()
        );


        assertEquals(
                requestId,
                response.getBloodRequestId()
        );


        assertEquals(
                hospitalId,
                response.getHospitalId()
        );


        assertEquals(
                2,
                response.getAllocatedUnits()
        );


        assertEquals(
                AllocationStatus.ALLOCATED,
                response.getStatus()
        );


        verify(
                bloodAllocationRepository,
                times(1)
        ).findById(allocationId);
    }


    // =====================================================
    // TEST 11
    // ALLOCATION NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenAllocationDoesNotExist() {

        when(
                bloodAllocationRepository.findById(
                        allocationId
                )
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodAllocationService.getAllocation(
                                        allocationId
                                )
                );


        assertEquals(
                "Allocation Not Found",
                exception.getMessage()
        );
    }


    // =====================================================
    // HELPER METHOD
    // =====================================================

    private BloodAllocation createAllocation(
            int units) {

        BloodAllocation allocation =
                new BloodAllocation();

        allocation.setId(
                UUID.randomUUID()
        );

        allocation.setDonor(
                donor
        );

        allocation.setBloodRequest(
                bloodRequest
        );

        allocation.setHospital(
                hospital
        );

        allocation.setAllocatedUnits(
                units
        );

        allocation.setStatus(
                AllocationStatus.ALLOCATED
        );

        allocation.setAllocatedAt(
                LocalDateTime.now()
        );

        return allocation;
    }
}