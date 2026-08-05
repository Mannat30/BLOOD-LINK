package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.AuthResponse;
import com.bloodlink.bloodlink_backend.dto.RegisterRequest;
import com.bloodlink.bloodlink_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
public class AuthController {
    private final AuthService serv;
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest req){
        return serv.register(req);
    }
}
