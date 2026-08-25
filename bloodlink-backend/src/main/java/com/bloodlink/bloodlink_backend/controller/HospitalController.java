package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.HospitalRequest;
import com.bloodlink.bloodlink_backend.dto.HospitalResponse;
import com.bloodlink.bloodlink_backend.service.HospitalService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/hospital")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(
            HospitalService hospitalService) {

        this.hospitalService = hospitalService;
    }


    // =====================================================
    // CREATE HOSPITAL PROFILE
    // =====================================================

    @PostMapping("/{userId}")
    public HospitalResponse createProfile(
            @PathVariable UUID userId,
            @Valid @RequestBody HospitalRequest request) {

        return hospitalService.createProfile(
                userId,
                request
        );
    }


    // =====================================================
    // GET HOSPITAL PROFILE
    // =====================================================

    @GetMapping("/{userId}")
    public HospitalResponse getProfile(
            @PathVariable UUID userId) {

        return hospitalService.getProfile(userId);
    }


    // =====================================================
    // UPDATE HOSPITAL PROFILE
    // =====================================================

    @PutMapping("/{userId}")
    public HospitalResponse updateProfile(
            @PathVariable UUID userId,
            @Valid @RequestBody HospitalRequest request) {

        return hospitalService.updateProfile(
                userId,
                request
        );
    }
}