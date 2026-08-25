package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.PatientRequest;
import com.bloodlink.bloodlink_backend.dto.PatientResponse;
import com.bloodlink.bloodlink_backend.service.PatientService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientService patientService;

    public PatientController(
            PatientService patientService) {

        this.patientService = patientService;
    }


    // =====================================================
    // CREATE PATIENT PROFILE
    // =====================================================

    @PostMapping("/{userId}")
    public PatientResponse createProfile(
            @PathVariable UUID userId,
            @Valid @RequestBody PatientRequest request) {

        return patientService.createProfile(
                userId,
                request
        );
    }


    // =====================================================
    // GET PATIENT PROFILE
    // =====================================================

    @GetMapping("/{userId}")
    public PatientResponse getProfile(
            @PathVariable UUID userId) {

        return patientService.getProfile(userId);
    }


    // =====================================================
    // UPDATE PATIENT PROFILE
    // =====================================================

    @PutMapping("/{userId}")
    public PatientResponse updateProfile(
            @PathVariable UUID userId,
            @Valid @RequestBody PatientRequest request) {

        return patientService.updateProfile(
                userId,
                request
        );
    }
}