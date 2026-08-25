package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.DonorMatchResponse;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.exception.ResourceNotFoundException;
import com.bloodlink.bloodlink_backend.repo.BloodRequestRepository;
import com.bloodlink.bloodlink_backend.service.MatchingService;
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

    // =====================================================
    // FIND ELIGIBLE DONORS
    // =====================================================

    @GetMapping("/eligible/{requestId}")
    public List<Donor> findEligibleDonors(
            @PathVariable UUID requestId) {

        BloodRequest request =
                bloodRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Blood Request Not Found"
                                )
                        );

        return matchingService.findEligibleDonors(request);
    }

    // =====================================================
    // RANK DONORS
    // =====================================================

    @PostMapping("/rank/{requestId}")
    public List<DonorMatchResponse> rankDonors(
            @PathVariable UUID requestId) {

        BloodRequest request =
                bloodRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Blood Request Not Found"
                                )
                        );

        List<DonorMatch> matches =
                matchingService.rankDonors(request);

        return matches.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =====================================================
    // CONVERT DONOR MATCH → DTO
    // =====================================================

    private DonorMatchResponse convertToResponse(
            DonorMatch match) {

        Donor donor = match.getDonor();

        return new DonorMatchResponse(

                match.getId(),

                donor.getId(),

                donor.getUser().getName(),

                donor.getBloodGroup(),

                donor.getCity(),

                match.getDistanceKm(),

                match.getCompatibilityScore(),

                match.getAvailabilityScore(),

                match.getDonationHistoryScore(),

                match.getReliabilityScore(),

                match.getBloodLinkScore(),

                match.getFinalScore(),

                match.getRank(),

                match.getNotificationSent(),

                match.getAccepted()
        );
    }
}