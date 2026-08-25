package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.AuthResponse;
import com.bloodlink.bloodlink_backend.dto.LoginRequest;
import com.bloodlink.bloodlink_backend.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest register);
    AuthResponse login(LoginRequest login);
}
