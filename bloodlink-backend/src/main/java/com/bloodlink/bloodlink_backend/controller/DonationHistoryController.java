package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.DonationHistoryRequest;
import com.bloodlink.bloodlink_backend.dto.DonationHistoryResponse;
import com.bloodlink.bloodlink_backend.service.DonationHistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/donations")
public class DonationHistoryController {

    private final DonationHistoryService donationHistoryService;

    public DonationHistoryController(DonationHistoryService donationHistoryService) {
        this.donationHistoryService = donationHistoryService;
    }

    @PostMapping("/{notificationId}")
    public DonationHistoryResponse donate(
            @PathVariable UUID notificationId,
            @RequestBody DonationHistoryRequest request) {

        return donationHistoryService.donate(notificationId, request);
    }

    @GetMapping
    public List<DonationHistoryResponse> getAll() {
        return donationHistoryService.getAllDonations();
    }

    @GetMapping("/{id}")
    public DonationHistoryResponse getOne(@PathVariable UUID id) {
        return donationHistoryService.getDonation(id);
    }
}