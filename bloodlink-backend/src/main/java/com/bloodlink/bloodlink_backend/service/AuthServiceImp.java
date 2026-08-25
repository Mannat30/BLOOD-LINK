package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.Userstatus;
import com.bloodlink.bloodlink_backend.dto.AuthResponse;
import com.bloodlink.bloodlink_backend.dto.LoginRequest;
import com.bloodlink.bloodlink_backend.dto.RegisterRequest;
import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.repo.Userrepo;
import com.bloodlink.bloodlink_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImp implements AuthService {

    private final Userrepo repo;
    private final PasswordEncoder encode;
    private final AuthenticationManager manager;
    private final JwtService jwtService;

    // =========================
    // REGISTER
    // =========================

    @Override
    public AuthResponse register(RegisterRequest req) {

        // Check duplicate email
        if (repo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Check duplicate phone
        if (repo.existsByPhoneNumber(req.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        // Create user
        User user = new User();

        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());

        // Encode password
        user.setPassword(
                encode.encode(req.getPassword())
        );

        user.setRole(req.getRole());
        user.setStatus(Userstatus.ACTIVE);

        // Save user
        repo.save(user);

        // Return response with user ID and role
        return new AuthResponse(
                null,
                "User registered successfully",
                user.getRole().name(),
                user.getId()
        );
    }

    // =========================
    // LOGIN
    // =========================

    @Override
    public AuthResponse login(LoginRequest req) {

        // 1. Authenticate user
        manager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(),
                        req.getPassword()
                )
        );

        // 2. Find user
        User user = repo.findByEmail(req.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        // 3. Generate JWT
        String token = jwtService.generateToken(user);

        // 4. Return token + role + user ID
        return new AuthResponse(
                token,
                "User logged in successfully",
                user.getRole().name(),
                user.getId()
        );
    }
}