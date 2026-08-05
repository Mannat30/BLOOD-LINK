package com.bloodlink.bloodlink_backend.dto;

import com.bloodlink.bloodlink_backend.Enum.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BloodResponse {

    private UUID requestId;

    private RequestStatus status;

    private String message;
}
