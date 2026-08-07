package com.bloodlink.bloodlink_backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class DonationHistoryResponse {

    private UUID donationId;

    private UUID donorId;

    private UUID requestId;

    private Integer unitsDonated;

    private LocalDateTime donationDate;

    private Boolean successful;
}