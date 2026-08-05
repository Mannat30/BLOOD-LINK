package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.repo.DonorRepo;
import com.bloodlink.bloodlink_backend.util.BloodCompatibilityUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class MatchingServiceImp implements MatchingService {

    private final DonorRepo donorRepo;

    public MatchingServiceImp(DonorRepo donorRepo) {
        this.donorRepo = donorRepo;
    }

    @Override

    public List<Donor> findEligibleDonors(BloodRequest request) {

        List<Donor> donors = donorRepo.findByAvailableTrue();

        List<Donor> eligibleDonors = new ArrayList<>();

        for (Donor donor : donors) {

            // Blood Group Compatibility
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

        // Ranking logic will be added in next step

        return eligibleDonors;
    }
}