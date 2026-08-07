package com.bloodlink.bloodlink_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100)
    private String name;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @Size(min = 8, max = 20,
            message = "Password must be between 8 and 20 characters")
    private String password;

    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Invalid phone number")
    private String phoneNumber;
}