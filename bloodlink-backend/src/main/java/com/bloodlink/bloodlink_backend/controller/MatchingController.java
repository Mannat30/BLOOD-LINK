package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.service.MatchingService;
import com.bloodlink.bloodlink_backend.repo.BloodRequestRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    private final MatchingService matchingService;
    private final BloodRequestRepository bloodRequestRepository;

    public MatchingController(
            MatchingService matchingService,
            BloodRequestRepository bloodRequestRepository) {

        this.matchingService = matchingService;
        this.bloodRequestRepository = bloodRequestRepository;
    }

    @GetMapping("/eligible/{requestId}")
    public List<Donor> findEligibleDonors(
            @PathVariable UUID requestId) {

        BloodRequest request =
                bloodRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Blood Request Not Found"
                                )
                        );

        return matchingService.findEligibleDonors(request);
    }

    @PostMapping("/rank/{requestId}")
    public List<?> rankDonors(
            @PathVariable UUID requestId) {

        BloodRequest request =
                bloodRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Blood Request Not Found"
                                )
                        );

        return matchingService.rankDonors(request);
    }
}