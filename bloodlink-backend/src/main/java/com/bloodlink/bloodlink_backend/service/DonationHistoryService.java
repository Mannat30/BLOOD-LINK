package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.DonationHistoryRequest;
import com.bloodlink.bloodlink_backend.dto.DonationHistoryResponse;

import java.util.List;
import java.util.UUID;

public interface DonationHistoryService {

    DonationHistoryResponse donate(UUID notificationId,
                                   DonationHistoryRequest request);

    List<DonationHistoryResponse> getAllDonations();

    DonationHistoryResponse getDonation(UUID donationId);
}