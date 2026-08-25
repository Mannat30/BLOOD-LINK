package com.bloodlink.bloodlink_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String message;
    private String role;
    private UUID userId;
}