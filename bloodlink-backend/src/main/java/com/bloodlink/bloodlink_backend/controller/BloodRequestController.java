package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.BloodRequestDto;
import com.bloodlink.bloodlink_backend.dto.BloodResponse;
import com.bloodlink.bloodlink_backend.service.BloodRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blood-request")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    public BloodRequestController(BloodRequestService bloodRequestService) {
        this.bloodRequestService = bloodRequestService;
    }

    @PostMapping
    public BloodResponse createRequest(
            @RequestBody BloodRequestDto request) {

        return bloodRequestService.createRequest(request);
    }

    @GetMapping("/{id}")
    public BloodResponse getRequest(@PathVariable UUID id) {

        return bloodRequestService.getRequest(id);
    }

    @GetMapping("/pending")
    public List<BloodResponse> getPendingRequests() {

        return bloodRequestService.getPendingRequests();
    }

    @DeleteMapping("/{id}")
    public BloodResponse cancelRequest(@PathVariable UUID id) {

        return bloodRequestService.cancelRequest(id);
    }
}
