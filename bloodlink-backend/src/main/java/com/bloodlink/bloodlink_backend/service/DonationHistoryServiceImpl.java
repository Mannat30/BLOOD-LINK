package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.DonationHistoryRequest;
import com.bloodlink.bloodlink_backend.dto.DonationHistoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DonationHistoryServiceImpl implements DonationHistoryService {

    @Override
    public DonationHistoryResponse donate(UUID notificationId,
                                          DonationHistoryRequest request) {

        return null;
    }

    @Override
    public List<DonationHistoryResponse> getAllDonations() {

        return null;
    }

    @Override
    public DonationHistoryResponse getDonation(UUID donationId) {

        return null;
    }
}