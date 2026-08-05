package com.bloodlink.bloodlink_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HospitalRequest {

    private String hospitalName;

    private String registrationNumber;

    private String contactPerson;

    private String contactPhone;

    private String city;

    private String state;

    private String pincode;

    private Double latitude;

    private Double longitude;
}