package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;

import java.util.List;

public interface MatchingService {

    List<Donor> findEligibleDonors(BloodRequest request);

    List<DonorMatch> rankDonors(BloodRequest request);
}