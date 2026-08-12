package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.DonationHistoryRequest;
import com.bloodlink.bloodlink_backend.dto.DonationHistoryResponse;
import com.bloodlink.bloodlink_backend.entity.DonationHistory;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.entity.Notification;
import com.bloodlink.bloodlink_backend.repo.DonationHistoryRepository;
import com.bloodlink.bloodlink_backend.repo.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DonationHistoryServiceImpl
        implements DonationHistoryService {

    private final DonationHistoryRepository donationHistoryRepository;
    private final NotificationRepository notificationRepository;

    public DonationHistoryServiceImpl(
            DonationHistoryRepository donationHistoryRepository,
            NotificationRepository notificationRepository) {

        this.donationHistoryRepository = donationHistoryRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public DonationHistoryResponse donate(
            UUID notificationId,
            DonationHistoryRequest request) {

        // 1. Find notification
        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification Not Found"
                                )
                        );

        // 2. Get donor match
        DonorMatch donorMatch =
                notification.getDonorMatch();

        if (donorMatch == null) {
            throw new RuntimeException(
                    "Donor Match Not Found"
            );
        }

        // 3. Get donor and blood request
        var donor = donorMatch.getDonor();
        var bloodRequest = donorMatch.getBloodRequest();

        // 4. Validate units
        if (request.getUnitsDonated() == null ||
                request.getUnitsDonated() <= 0) {

            throw new RuntimeException(
                    "Units donated must be greater than 0"
            );
        }

        // 5. Create donation history
        DonationHistory donation =
                new DonationHistory();

        donation.setDonor(donor);
        donation.setBloodRequest(bloodRequest);
        donation.setUnitsDonated(
                request.getUnitsDonated()
        );

        donation.setSuccessful(true);

        // 6. Save
        DonationHistory savedDonation =
                donationHistoryRepository.save(donation);

        // 7. Prepare response
        DonationHistoryResponse response =
                new DonationHistoryResponse();

        response.setDonationId(
                savedDonation.getId()
        );

        response.setDonorId(
                savedDonation.getDonor().getId()
        );

        response.setRequestId(
                savedDonation.getBloodRequest().getId()
        );

        response.setUnitsDonated(
                savedDonation.getUnitsDonated()
        );

        response.setDonationDate(
                savedDonation.getDonationDate()
        );

        response.setSuccessful(
                savedDonation.getSuccessful()
        );

        return response;
    }

    @Override
    public List<DonationHistoryResponse> getAllDonations() {

        return donationHistoryRepository.findAll()
                .stream()
                .map(donation -> {

                    DonationHistoryResponse response =
                            new DonationHistoryResponse();

                    response.setDonationId(
                            donation.getId()
                    );

                    response.setDonorId(
                            donation.getDonor().getId()
                    );

                    response.setRequestId(
                            donation.getBloodRequest().getId()
                    );

                    response.setUnitsDonated(
                            donation.getUnitsDonated()
                    );

                    response.setDonationDate(
                            donation.getDonationDate()
                    );

                    response.setSuccessful(
                            donation.getSuccessful()
                    );

                    return response;

                })
                .toList();
    }

    @Override
    public DonationHistoryResponse getDonation(
            UUID donationId) {

        DonationHistory donation =
                donationHistoryRepository.findById(donationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Donation Not Found"
                                )
                        );

        DonationHistoryResponse response =
                new DonationHistoryResponse();

        response.setDonationId(
                donation.getId()
        );

        response.setDonorId(
                donation.getDonor().getId()
        );

        response.setRequestId(
                donation.getBloodRequest().getId()
        );

        response.setUnitsDonated(
                donation.getUnitsDonated()
        );

        response.setDonationDate(
                donation.getDonationDate()
        );

        response.setSuccessful(
                donation.getSuccessful()
        );

        return response;
    }
}