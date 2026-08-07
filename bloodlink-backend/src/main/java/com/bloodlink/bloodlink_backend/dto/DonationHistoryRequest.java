package com.bloodlink.bloodlink_backend.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonationHistoryRequest {

    @Min(value = 1)
    private Integer unitsDonated;
}