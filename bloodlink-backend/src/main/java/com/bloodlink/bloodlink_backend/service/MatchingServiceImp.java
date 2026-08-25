package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.RequestPriority;
import com.bloodlink.bloodlink_backend.dto.EmergencyAlert;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.repo.DonorMatchRepository;
import com.bloodlink.bloodlink_backend.repo.DonorRepo;
import com.bloodlink.bloodlink_backend.util.BloodCompatibilityUtil;
import com.bloodlink.bloodlink_backend.util.DistanceCalculator;
import com.bloodlink.bloodlink_backend.util.ScoreCalculator;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class MatchingServiceImp implements MatchingService {

    private final DonorRepo donorRepo;
    private final DonorMatchRepository donorMatchRepository;
    private final RealtimeNotificationService realtimeNotificationService;

    public MatchingServiceImp(
            DonorRepo donorRepo,
            DonorMatchRepository donorMatchRepository,
            RealtimeNotificationService realtimeNotificationService) {

        this.donorRepo = donorRepo;
        this.donorMatchRepository = donorMatchRepository;
        this.realtimeNotificationService =
                realtimeNotificationService;
    }

    // =====================================================
    // DETERMINE SEARCH RADIUS
    // =====================================================

    private double getSearchRadius(BloodRequest request) {

        if (request.getPriority() == null) {
            return 50.0;
        }

        return switch (request.getPriority()) {

            case CRITICAL -> 10.0;

            case HIGH -> 25.0;

            default -> 50.0;
        };
    }


    // =====================================================
    // FIND ELIGIBLE DONORS
    // =====================================================

    @Override
    public List<Donor> findEligibleDonors(
            BloodRequest request) {

        // =================================================
        // 1. GET HOSPITAL LOCATION
        // =================================================

        double hospitalLatitude =
                request.getHospital().getLatitude();

        double hospitalLongitude =
                request.getHospital().getLongitude();


        // =================================================
        // 2. DETERMINE SEARCH RADIUS
        // =================================================

        double radiusKm =
                getSearchRadius(request);

        double radiusMeters =
                radiusKm * 1000;


        // =================================================
        // 3. POSTGIS SPATIAL SEARCH
        // =================================================

        List<Donor> donors =
                donorRepo.findAvailableDonorsWithinRadius(
                        hospitalLatitude,
                        hospitalLongitude,
                        radiusMeters
                );


        List<Donor> eligibleDonors =
                new ArrayList<>();


        // =================================================
        // 4. BLOOD + DONATION ELIGIBILITY
        // =================================================

        for (Donor donor : donors) {

            // Blood compatibility
            if (!BloodCompatibilityUtil.isCompatible(
                    donor.getBloodGroup(),
                    request.getBloodGroup())) {

                continue;
            }


            // 90-day donation rule
            if (donor.getLastDonationDate() != null) {

                long days =
                        ChronoUnit.DAYS.between(
                                donor.getLastDonationDate(),
                                LocalDate.now()
                        );

                if (days < 90) {
                    continue;
                }
            }


            eligibleDonors.add(donor);
        }


        return eligibleDonors;
    }


    // =====================================================
    // RANK DONORS
    // =====================================================

    @Override
    public List<DonorMatch> rankDonors(
            BloodRequest request) {

        // =================================================
        // 1. GET ELIGIBLE DONORS
        // =================================================

        List<Donor> eligibleDonors =
                findEligibleDonors(request);


        List<DonorMatch> matches =
                new ArrayList<>();


        // =================================================
        // 2. CALCULATE SCORE FOR EACH DONOR
        // =================================================

        for (Donor donor : eligibleDonors) {

            // =============================================
            // DISTANCE
            // =============================================

            double distance =
                    DistanceCalculator.calculateDistance(

                            donor.getLatitude(),
                            donor.getLongitude(),

                            request.getHospital().getLatitude(),
                            request.getHospital().getLongitude()
                    );


            // =============================================
            // COMPATIBILITY
            // =============================================

            double compatibilityScore =
                    35.0;


            // =============================================
            // AVAILABILITY
            // =============================================

            double availabilityScore =
                    Boolean.TRUE.equals(
                            donor.getAvailable()
                    )
                            ? 15.0
                            : 0.0;


            // =============================================
            // DONATION HISTORY
            // =============================================

            int successfulDonations =
                    donor.getSuccessfulDonations() == null
                            ? 0
                            : donor.getSuccessfulDonations();

            double donationHistoryScore =
                    ScoreCalculator.calculateDonationHistoryScore(
                            successfulDonations
                    );


            // =============================================
            // RELIABILITY
            // =============================================

            int accepted =
                    donor.getTotalRequestsAccepted() == null
                            ? 0
                            : donor.getTotalRequestsAccepted();

            int rejected =
                    donor.getTotalRequestsRejected() == null
                            ? 0
                            : donor.getTotalRequestsRejected();

            double reliabilityScore =
                    ScoreCalculator.calculateReliabilityScore(
                            accepted,
                            rejected
                    );


            // =============================================
            // BLOODLINK SCORE
            // =============================================

            double bloodLinkScore =
                    donor.getBloodLinkScore() == null
                            ? 0.0
                            : donor.getBloodLinkScore();


            // =============================================
            // FINAL SCORE
            // =============================================

            double finalScore =
                    ScoreCalculator.calculateScore(

                            distance,

                            compatibilityScore,

                            availabilityScore,

                            donationHistoryScore,

                            reliabilityScore,

                            bloodLinkScore,

                            request.getPriority()
                    );


            // =============================================
            // CREATE MATCH
            // =============================================

            DonorMatch match =
                    new DonorMatch();

            match.setBloodRequest(request);

            match.setDonor(donor);

            match.setDistanceKm(distance);

            match.setCompatibilityScore(
                    compatibilityScore
            );

            match.setAvailabilityScore(
                    availabilityScore
            );

            match.setDonationHistoryScore(
                    donationHistoryScore
            );

            match.setReliabilityScore(
                    reliabilityScore
            );

            match.setBloodLinkScore(
                    bloodLinkScore
            );

            match.setFinalScore(
                    finalScore
            );

            match.setNotificationSent(false);

            match.setAccepted(false);


            // =============================================
            // IMPORTANT:
            // SAVE FIRST
            // Hibernate generates DonorMatch ID here
            // =============================================

            DonorMatch savedMatch =
                    donorMatchRepository.save(match);

            System.out.println(
                    "DonorMatch created: " +
                            savedMatch.getId()
            );

            System.out.println(
                    "Donor ID: " +
                            savedMatch.getDonor().getId()
            );

            System.out.println(
                    "Final Score: " +
                            savedMatch.getFinalScore()
            );


            // Add SAVED match to response list
            matches.add(savedMatch);
        }


        // =================================================
        // 3. SORT BY FINAL SCORE
        // =================================================

        matches.sort(
                Comparator
                        .comparing(
                                DonorMatch::getFinalScore
                        )
                        .reversed()
        );


        // =================================================
        // 4. ASSIGN RANK + UPDATE DATABASE
        // =================================================

        int rank = 1;

        for (DonorMatch match : matches) {

            match.setRank(rank++);

            donorMatchRepository.save(match);

            System.out.println(
                    "DonorMatch ID: " +
                            match.getId() +
                            " | Rank: " +
                            match.getRank()
            );
        }


        // =================================================
        // 5. REAL-TIME EMERGENCY ALERT
        // =================================================

        if (request.getPriority() ==
                RequestPriority.CRITICAL) {

            matches.stream()
                    .limit(10)
                    .forEach(match -> {

                        Donor donor =
                                match.getDonor();

                        EmergencyAlert alert =
                                new EmergencyAlert(

                                        request.getId(),

                                        request.getBloodGroup(),

                                        request.getHospital()
                                                .getHospitalName(),

                                        request.getHospital()
                                                .getCity(),

                                        request.getUnitsRequired(),

                                        request.getPriority(),

                                        match.getDistanceKm()
                                );


                        realtimeNotificationService
                                .sendEmergencyAlert(
                                        donor.getId(),
                                        alert
                                );
                    });
        }


        // =================================================
        // 6. RETURN TOP 10
        // =================================================

        return matches
                .stream()
                .limit(10)
                .toList();
    }
}