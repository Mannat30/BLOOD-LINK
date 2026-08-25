package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.DonationHistoryRequest;
import com.bloodlink.bloodlink_backend.dto.DonationHistoryResponse;
import com.bloodlink.bloodlink_backend.entity.DonationHistory;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import com.bloodlink.bloodlink_backend.entity.Notification;
import com.bloodlink.bloodlink_backend.Enum.NotificationStatus;
import com.bloodlink.bloodlink_backend.repo.DonationHistoryRepository;
import com.bloodlink.bloodlink_backend.repo.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        this.donationHistoryRepository =
                donationHistoryRepository;

        this.notificationRepository =
                notificationRepository;
    }


    // =====================================================
    // RECORD DONATION
    // =====================================================

    @Override
    @Transactional
    public DonationHistoryResponse donate(
            UUID notificationId,
            DonationHistoryRequest request) {

        // =================================================
        // 1. FIND NOTIFICATION
        // =================================================

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification Not Found"
                                )
                        );


        // =================================================
        // 2. GET DONOR MATCH
        // =================================================

        DonorMatch donorMatch =
                notification.getDonorMatch();

        if (donorMatch == null) {

            throw new RuntimeException(
                    "Donor Match Not Found"
            );
        }


        // =================================================
        // 3. CHECK ACCEPTANCE
        // =================================================

        if (!Boolean.TRUE.equals(
                donorMatch.getAccepted())) {

            throw new RuntimeException(
                    "Donation cannot be recorded because the donor has not accepted the request"
            );
        }


        // =================================================
        // 4. GET DONOR + BLOOD REQUEST
        // =================================================

        Donor donor =
                donorMatch.getDonor();

        var bloodRequest =
                donorMatch.getBloodRequest();


        // =================================================
        // 5. VALIDATE UNITS
        // =================================================

        if (request.getUnitsDonated() == null ||
                request.getUnitsDonated() <= 0) {

            throw new RuntimeException(
                    "Units donated must be greater than 0"
            );
        }


        int unitsDonated =
                request.getUnitsDonated();


        // =================================================
        // 6. CREATE DONATION HISTORY
        // =================================================

        DonationHistory donation =
                new DonationHistory();

        donation.setDonor(donor);

        donation.setBloodRequest(
                bloodRequest
        );

        donation.setUnitsDonated(
                unitsDonated
        );

        donation.setSuccessful(true);


        // =================================================
        // 7. SAVE DONATION
        // =================================================

        DonationHistory savedDonation =
                donationHistoryRepository.save(
                        donation
                );


        // =================================================
        // 8. UPDATE DONOR STATISTICS
        // =================================================

        int successfulDonations =
                donor.getSuccessfulDonations() == null
                        ? 0
                        : donor.getSuccessfulDonations();

        donor.setSuccessfulDonations(
                successfulDonations + 1
        );


        int acceptedRequests =
                donor.getTotalRequestsAccepted() == null
                        ? 0
                        : donor.getTotalRequestsAccepted();

        donor.setTotalRequestsAccepted(
                acceptedRequests + 1
        );


        // Donor is no longer immediately available
        donor.setAvailable(false);


        // =================================================
        // 9. PREPARE RESPONSE
        // =================================================

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


    // =====================================================
    // GET ALL DONATIONS
    // =====================================================

    @Override
    public List<DonationHistoryResponse> getAllDonations() {

        return donationHistoryRepository
                .findAll()
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


    // =====================================================
    // GET DONATION BY ID
    // =====================================================

    @Override
    public DonationHistoryResponse getDonation(
            UUID donationId) {

        DonationHistory donation =
                donationHistoryRepository
                        .findById(donationId)
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