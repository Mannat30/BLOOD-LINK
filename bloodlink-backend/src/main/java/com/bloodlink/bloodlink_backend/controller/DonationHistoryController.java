package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.DonationHistoryRequest;
import com.bloodlink.bloodlink_backend.dto.DonationHistoryResponse;
import com.bloodlink.bloodlink_backend.service.DonationHistoryService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/donations")
public class DonationHistoryController {

    private final DonationHistoryService donationHistoryService;

    public DonationHistoryController(
            DonationHistoryService donationHistoryService) {

        this.donationHistoryService = donationHistoryService;
    }


    // =====================================================
    // CREATE DONATION
    // =====================================================

    @PostMapping("/{notificationId}")
    public DonationHistoryResponse donate(
            @PathVariable UUID notificationId,
            @Valid @RequestBody DonationHistoryRequest request) {

        return donationHistoryService.donate(
                notificationId,
                request
        );
    }


    // =====================================================
    // GET ALL DONATIONS
    // =====================================================

    @GetMapping
    public List<DonationHistoryResponse> getAll() {

        return donationHistoryService.getAllDonations();
    }


    // =====================================================
    // GET ONE DONATION
    // =====================================================

    @GetMapping("/{id}")
    public DonationHistoryResponse getOne(
            @PathVariable UUID id) {

        return donationHistoryService.getDonation(id);
    }
}