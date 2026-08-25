package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.BloodRequestDto;
import com.bloodlink.bloodlink_backend.dto.BloodResponse;
import com.bloodlink.bloodlink_backend.service.BloodRequestService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blood-request")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    public BloodRequestController(
            BloodRequestService bloodRequestService) {

        this.bloodRequestService = bloodRequestService;
    }


    // =====================================================
    // CREATE BLOOD REQUEST
    // =====================================================

    @PostMapping
    public BloodResponse createRequest(
            @Valid @RequestBody BloodRequestDto request) {

        return bloodRequestService.createRequest(request);
    }


    // =====================================================
    // GET BLOOD REQUEST
    // =====================================================

    @GetMapping("/{id}")
    public BloodResponse getRequest(
            @PathVariable UUID id) {

        return bloodRequestService.getRequest(id);
    }


    // =====================================================
    // GET PENDING REQUESTS
    // =====================================================

    @GetMapping("/pending")
    public List<BloodResponse> getPendingRequests() {

        return bloodRequestService.getPendingRequests();
    }


    // =====================================================
    // CANCEL BLOOD REQUEST
    // =====================================================

    @DeleteMapping("/{id}")
    public BloodResponse cancelRequest(
            @PathVariable UUID id) {

        return bloodRequestService.cancelRequest(id);
    }
}