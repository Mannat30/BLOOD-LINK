package com.bloodlink.bloodlink_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    @Pattern(
            regexp = "^\\S+$",
            message = "Email cannot contain spaces"
    )
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^\\S+$",
            message = "Password cannot contain spaces"
    )
    private String password;
}