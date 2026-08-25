package com.bloodlink.bloodlink_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BloodAllocationRequest {

    @NotNull
    @Min(1)
    @JsonProperty("allocatedUnits")
    private Integer allocatedUnits;
}