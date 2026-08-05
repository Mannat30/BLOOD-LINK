package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.PatientRequest;
import com.bloodlink.bloodlink_backend.dto.PatientResponse;

import java.util.UUID;

public interface PatientService {

    PatientResponse createProfile(UUID userId, PatientRequest request);

    PatientResponse getProfile(UUID userId);

    PatientResponse updateProfile(UUID userId, PatientRequest request);

}