package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.BloodRequestDto;
import com.bloodlink.bloodlink_backend.dto.BloodResponse;

import java.util.List;
import java.util.UUID;

public interface BloodRequestService {

    BloodResponse createRequest(BloodRequestDto request);

    BloodResponse getRequest(UUID requestId);

    List<BloodResponse> getPendingRequests();

    BloodResponse cancelRequest(UUID requestId);
}
