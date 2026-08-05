package com.bloodlink.bloodlink_backend.service;
import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.service.AuthService;
import com.bloodlink.bloodlink_backend.dto.AuthResponse;
import com.bloodlink.bloodlink_backend.dto.LoginRequest;
import com.bloodlink.bloodlink_backend.dto.RegisterRequest;
import com.bloodlink.bloodlink_backend.repo.Userrepo;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImp implements AuthService{
    private final Userrepo repo;
    private final PasswordEncoder encode;
    private final AuthenticationManager manager;
    @Override
    public AuthResponse register(RegisterRequest req){
        if(repo.existsByEmail(req.getEmail())){
            throw new RuntimeException("Email already exists");
        }
        if(repo.existsByPhoneNumber(req.getPhoneNumber())){
            throw new RuntimeException("Phone number already exists");
        }
        User user=new User();
        user.setName(req.getName());
        user.setRole(req.getRole());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setPassword(encode.encode(req.getPassword()));
        user.setStatus(req.getStatus());
        repo.save(user);
        return new AuthResponse(null,"User registered successfully");
    }
    public AuthResponse login(LoginRequest req){
   manager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(),req.getPassword()));
        return new AuthResponse(null,"User logged in successfully");
    }


}
