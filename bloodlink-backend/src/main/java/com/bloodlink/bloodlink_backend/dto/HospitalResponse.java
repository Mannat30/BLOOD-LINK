package com.bloodlink.bloodlink_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class HospitalResponse {

    private String hospitalName;

    private String city;

    private Boolean verified;
}