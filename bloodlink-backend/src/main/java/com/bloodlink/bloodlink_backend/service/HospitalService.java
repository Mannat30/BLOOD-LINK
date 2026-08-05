package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.HospitalRequest;
import com.bloodlink.bloodlink_backend.dto.HospitalResponse;

import java.util.UUID;

public interface HospitalService {

    HospitalResponse createProfile(UUID userId,
                                   HospitalRequest request);

    HospitalResponse getProfile(UUID userId);

    HospitalResponse updateProfile(UUID userId,
                                   HospitalRequest request);
}