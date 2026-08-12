package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.BloodAllocationRequest;
import com.bloodlink.bloodlink_backend.dto.BloodAllocationResponse;
import com.bloodlink.bloodlink_backend.service.BloodAllocationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/blood-allocation")
public class BloodAllocationController {

    private final BloodAllocationService bloodAllocationService;

    public BloodAllocationController(
            BloodAllocationService bloodAllocationService) {

        this.bloodAllocationService = bloodAllocationService;
    }

    @PostMapping("/{donationId}")
    public BloodAllocationResponse allocateBlood(
            @PathVariable UUID donationId,
            @Valid @RequestBody BloodAllocationRequest request) {

        System.out.println(
                "========== CONTROLLER UNITS ========== "
                        + request.getAllocatedUnits()
        );

        return bloodAllocationService.allocateBlood(
                donationId,
                request
        );
    }

    @GetMapping
    public List<BloodAllocationResponse> getAll() {

        return bloodAllocationService.getAllAllocations();
    }

    @GetMapping("/{id}")
    public BloodAllocationResponse getOne(
            @PathVariable UUID id) {

        return bloodAllocationService.getAllocation(id);
    }
}