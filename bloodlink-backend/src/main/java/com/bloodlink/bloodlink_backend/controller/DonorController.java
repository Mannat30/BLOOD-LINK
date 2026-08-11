package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.DonorProfileRequest;
import com.bloodlink.bloodlink_backend.dto.DonorResponse;
import com.bloodlink.bloodlink_backend.service.DonorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
public class DonorController {

    private final DonorService donorService;

    // ==========================================
    // CREATE DONOR PROFILE
    // ==========================================

    @PostMapping("/{userId}")
    public ResponseEntity<DonorResponse> createProfile(
            @PathVariable UUID userId,
            @Valid @RequestBody DonorProfileRequest request) {

        DonorResponse response =
                donorService.createProfile(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ==========================================
    // GET DONOR PROFILE
    // ==========================================

    @GetMapping("/{userId}")
    public ResponseEntity<DonorResponse> getProfile(
            @PathVariable UUID userId) {

        DonorResponse response =
                donorService.getProfile(userId);

        return ResponseEntity.ok(response);
    }


    // ==========================================
    // UPDATE DONOR PROFILE
    // ==========================================

    @PutMapping("/{userId}")
    public ResponseEntity<DonorResponse> updateProfile(
            @PathVariable UUID userId,
            @Valid @RequestBody DonorProfileRequest request) {

        DonorResponse response =
                donorService.updateProfile(userId, request);

        return ResponseEntity.ok(response);
    }
}