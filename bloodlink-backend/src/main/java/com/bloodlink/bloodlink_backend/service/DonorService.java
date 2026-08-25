package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.DonorProfileRequest;
import com.bloodlink.bloodlink_backend.dto.DonorProfileRequest;
import com.bloodlink.bloodlink_backend.dto.DonorResponse;

import java.util.UUID;

public interface DonorService {

    DonorResponse createProfile(UUID userId,
                                 DonorProfileRequest request);

    DonorResponse getProfile(UUID userId);

    DonorResponse updateProfile(UUID userId,
                                       DonorProfileRequest request);
}