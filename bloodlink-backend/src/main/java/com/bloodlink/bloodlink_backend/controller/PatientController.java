package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.PatientRequest;
import com.bloodlink.bloodlink_backend.dto.PatientResponse;
import com.bloodlink.bloodlink_backend.service.PatientService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/{userId}")
    public PatientResponse createProfile(@PathVariable UUID userId,
                                         @RequestBody PatientRequest request) {

        return patientService.createProfile(userId, request);
    }

    @GetMapping("/{userId}")
    public PatientResponse getProfile(@PathVariable UUID userId) {

        return patientService.getProfile(userId);
    }

    @PutMapping("/{userId}")
    public PatientResponse updateProfile(@PathVariable UUID userId,
                                         @RequestBody PatientRequest request) {

        return patientService.updateProfile(userId, request);
    }
}