package com.bloodlink.bloodlink_backend.dto;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DonorMatchResponse {

    private UUID matchId;

    private UUID donorId;

    private String donorName;

    private BloodGroup bloodGroup;

    private String city;

    private Double distanceKm;

    private Double compatibilityScore;

    private Double availabilityScore;

    private Double donationHistoryScore;

    private Double reliabilityScore;

    private Double bloodLinkScore;

    private Double finalScore;

    private Integer rank;

    private Boolean notificationSent;

    private Boolean accepted;
}