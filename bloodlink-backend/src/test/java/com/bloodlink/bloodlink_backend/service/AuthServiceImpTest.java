package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.Role;
import com.bloodlink.bloodlink_backend.dto.AuthResponse;
import com.bloodlink.bloodlink_backend.dto.LoginRequest;
import com.bloodlink.bloodlink_backend.dto.RegisterRequest;
import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.repo.Userrepo;
import com.bloodlink.bloodlink_backend.security.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class AuthServiceImpTest {

    @Mock
    private Userrepo repo;

    @Mock
    private PasswordEncoder encode;

    @Mock
    private AuthenticationManager manager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthServiceImp authService;

    private RegisterRequest registerRequest;

    private LoginRequest loginRequest;

    private User user;

    private UUID userId;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        userId = UUID.randomUUID();


        // =========================
        // REGISTER REQUEST
        // =========================

        registerRequest = new RegisterRequest();

        registerRequest.setName("Mannat");

        registerRequest.setEmail(
                "mannat@example.com"
        );

        registerRequest.setPhoneNumber(
                "9876543210"
        );

        registerRequest.setPassword(
                "Password@123"
        );

        registerRequest.setRole(
                Role.DONOR
        );


        // =========================
        // LOGIN REQUEST
        // =========================

        loginRequest = new LoginRequest();

        loginRequest.setEmail(
                "mannat@example.com"
        );

        loginRequest.setPassword(
                "Password@123"
        );


        // =========================
        // USER
        // =========================

        user = new User();

        user.setId(userId);

        user.setName("Mannat");

        user.setEmail(
                "mannat@example.com"
        );

        user.setPhoneNumber(
                "9876543210"
        );

        user.setRole(
                Role.DONOR
        );
    }


    // =====================================================
    // TEST 1
    // REGISTER SUCCESS
    // =====================================================

    @Test
    void shouldRegisterUser() {

        when(
                repo.existsByEmail(
                        registerRequest.getEmail()
                )
        ).thenReturn(false);


        when(
                repo.existsByPhoneNumber(
                        registerRequest.getPhoneNumber()
                )
        ).thenReturn(false);


        when(
                encode.encode(
                        registerRequest.getPassword()
                )
        ).thenReturn(
                "encoded-password"
        );


        when(
                repo.save(any(User.class))
        ).thenAnswer(invocation -> {

            User savedUser =
                    invocation.getArgument(0);

            savedUser.setId(userId);

            return savedUser;
        });


        AuthResponse response =
                authService.register(
                        registerRequest
                );


        assertNotNull(response);


        assertEquals(
                "User registered successfully",
                response.getMessage()
        );


        assertEquals(
                "DONOR",
                response.getRole()
        );


        assertEquals(
                userId,
                response.getUserId()
        );


        verify(
                repo,
                times(1)
        ).existsByEmail(
                registerRequest.getEmail()
        );


        verify(
                repo,
                times(1)
        ).existsByPhoneNumber(
                registerRequest.getPhoneNumber()
        );


        verify(
                encode,
                times(1)
        ).encode(
                registerRequest.getPassword()
        );


        verify(
                repo,
                times(1)
        ).save(
                any(User.class)
        );
    }


    // =====================================================
    // TEST 2
    // DUPLICATE EMAIL
    // =====================================================

    @Test
    void shouldRejectDuplicateEmail() {

        when(
                repo.existsByEmail(
                        registerRequest.getEmail()
                )
        ).thenReturn(true);


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                authService.register(
                                        registerRequest
                                )
                );


        assertEquals(
                "Email already exists",
                exception.getMessage()
        );


        verify(
                repo,
                times(1)
        ).existsByEmail(
                registerRequest.getEmail()
        );


        verify(
                repo,
                never()
        ).existsByPhoneNumber(anyString());


        verify(
                repo,
                never()
        ).save(any(User.class));


        verify(
                encode,
                never()
        ).encode(anyString());
    }


    // =====================================================
    // TEST 3
    // DUPLICATE PHONE
    // =====================================================

    @Test
    void shouldRejectDuplicatePhoneNumber() {

        when(
                repo.existsByEmail(
                        registerRequest.getEmail()
                )
        ).thenReturn(false);


        when(
                repo.existsByPhoneNumber(
                        registerRequest.getPhoneNumber()
                )
        ).thenReturn(true);


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                authService.register(
                                        registerRequest
                                )
                );


        assertEquals(
                "Phone number already exists",
                exception.getMessage()
        );


        verify(
                repo,
                times(1)
        ).existsByEmail(
                registerRequest.getEmail()
        );


        verify(
                repo,
                times(1)
        ).existsByPhoneNumber(
                registerRequest.getPhoneNumber()
        );


        verify(
                repo,
                never()
        ).save(any(User.class));


        verify(
                encode,
                never()
        ).encode(anyString());
    }


    // =====================================================
    // TEST 4
    // PASSWORD ENCODING
    // =====================================================

    @Test
    void shouldEncodePasswordBeforeSaving() {

        when(
                repo.existsByEmail(anyString())
        ).thenReturn(false);


        when(
                repo.existsByPhoneNumber(anyString())
        ).thenReturn(false);


        when(
                encode.encode(
                        registerRequest.getPassword()
                )
        ).thenReturn(
                "encoded-password"
        );


        when(
                repo.save(any(User.class))
        ).thenAnswer(invocation -> {

            User savedUser =
                    invocation.getArgument(0);

            savedUser.setId(userId);

            return savedUser;
        });


        authService.register(
                registerRequest
        );


        ArgumentCaptor<User> captor =
                ArgumentCaptor.forClass(
                        User.class
                );


        verify(
                repo,
                times(1)
        ).save(
                captor.capture()
        );


        User savedUser =
                captor.getValue();


        assertEquals(
                "encoded-password",
                savedUser.getPassword()
        );


        assertEquals(
                registerRequest.getEmail(),
                savedUser.getEmail()
        );


        assertEquals(
                registerRequest.getPhoneNumber(),
                savedUser.getPhoneNumber()
        );


        assertEquals(
                Role.DONOR,
                savedUser.getRole()
        );
    }


    // =====================================================
    // TEST 5
    // LOGIN SUCCESS
    // =====================================================

    @Test
    void shouldLoginUser() {

        when(
                repo.findByEmail(
                        loginRequest.getEmail()
                )
        ).thenReturn(
                Optional.of(user)
        );


        when(
                jwtService.generateToken(user)
        ).thenReturn(
                "jwt-token"
        );


        AuthResponse response =
                authService.login(
                        loginRequest
                );


        assertNotNull(response);


        assertEquals(
                "jwt-token",
                response.getToken()
        );


        assertEquals(
                "User logged in successfully",
                response.getMessage()
        );


        assertEquals(
                "DONOR",
                response.getRole()
        );


        assertEquals(
                userId,
                response.getUserId()
        );


        verify(
                manager,
                times(1)
        ).authenticate(any())
        ;


        verify(
                repo,
                times(1)
        ).findByEmail(
                loginRequest.getEmail()
        );


        verify(
                jwtService,
                times(1)
        ).generateToken(user);
    }


    // =====================================================
    // TEST 6
    // USER NOT FOUND
    // =====================================================

    @Test
    void shouldRejectLoginWhenUserNotFound() {

        when(
                repo.findByEmail(
                        loginRequest.getEmail()
                )
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                authService.login(
                                        loginRequest
                                )
                );


        assertEquals(
                "User not found",
                exception.getMessage()
        );


        verify(
                manager,
                times(1)
        ).authenticate(any());


        verify(
                repo,
                times(1)
        ).findByEmail(
                loginRequest.getEmail()
        );


        verify(
                jwtService,
                never()
        ).generateToken(any(User.class));
    }


    // =====================================================
    // TEST 7
    // JWT GENERATION
    // =====================================================

    @Test
    void shouldGenerateJwtAfterSuccessfulLogin() {

        when(
                repo.findByEmail(
                        loginRequest.getEmail()
                )
        ).thenReturn(
                Optional.of(user)
        );


        when(
                jwtService.generateToken(user)
        ).thenReturn(
                "test-jwt-token"
        );


        AuthResponse response =
                authService.login(
                        loginRequest
                );


        assertEquals(
                "test-jwt-token",
                response.getToken()
        );


        verify(
                jwtService,
                times(1)
        ).generateToken(user);
    }
}