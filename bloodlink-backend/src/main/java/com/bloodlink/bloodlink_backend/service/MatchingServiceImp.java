package com.bloodlink.bloodlink_backend.service;

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

    public MatchingServiceImp(DonorRepo donorRepo,
                              DonorMatchRepository donorMatchRepository) {

        this.donorRepo = donorRepo;
        this.donorMatchRepository = donorMatchRepository;
    }

    @Override
    public List<Donor> findEligibleDonors(BloodRequest request) {

        List<Donor> donors = donorRepo.findByAvailableTrue();

        List<Donor> eligibleDonors = new ArrayList<>();

        for (Donor donor : donors) {

            // Blood Compatibility
            if (!BloodCompatibilityUtil.isCompatible(
                    donor.getBloodGroup(),
                    request.getBloodGroup())) {
                continue;
            }

            // 90 Days Rule
            if (donor.getLastDonationDate() != null) {

                long days = ChronoUnit.DAYS.between(
                        donor.getLastDonationDate(),
                        LocalDate.now());

                if (days < 90) {
                    continue;
                }
            }

            eligibleDonors.add(donor);
        }

        return eligibleDonors;
    }
    @Override
    public List<DonorMatch> rankDonors(BloodRequest request) {

        List<Donor> eligibleDonors = findEligibleDonors(request);

        List<DonorMatch> matches = new ArrayList<>();

        for (Donor donor : eligibleDonors) {

            double distance = DistanceCalculator.calculateDistance(
                    donor.getLatitude(),
                    donor.getLongitude(),
                    request.getHospital().getLatitude(),
                    request.getHospital().getLongitude()
            );

            double score = ScoreCalculator.calculateScore(
                    distance,
                    donor.getBloodLinkScore(),
                    donor.getSuccessfulDonations(),
                    donor.getAvailable()
            );

            DonorMatch match = new DonorMatch();

            match.setBloodRequest(request);
            match.setDonor(donor);

            match.setDistanceKm(distance);
            match.setCompatibilityScore(100.0);
            match.setAvailabilityScore(donor.getAvailable() ? 20.0 : 0.0);
            match.setDonationHistoryScore(
                    Math.min(donor.getSuccessfulDonations() * 2.0, 20.0)
            );
            match.setBloodLinkScore(donor.getBloodLinkScore());
            match.setFinalScore(score);

            match.setNotificationSent(false);
            match.setAccepted(false);

            matches.add(match);
        }

        matches.sort(
                Comparator.comparing(DonorMatch::getFinalScore).reversed()
        );

        int rank = 1;

        for (DonorMatch match : matches) {
            match.setRank(rank++);
            donorMatchRepository.save(match);
        }

        return matches.stream()
                .limit(10)
                .toList();
    }
}