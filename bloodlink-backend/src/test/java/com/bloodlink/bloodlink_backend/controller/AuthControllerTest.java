package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.AuthResponse;
import com.bloodlink.bloodlink_backend.dto.LoginRequest;
import com.bloodlink.bloodlink_backend.dto.RegisterRequest;
import com.bloodlink.bloodlink_backend.exception.GlobalExceptionHandler;
import com.bloodlink.bloodlink_backend.service.AuthService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        mockMvc = MockMvcBuilders
                .standaloneSetup(authController)
                .setControllerAdvice(
                        new GlobalExceptionHandler()
                )
                .build();
    }


    // =====================================================
    // TEST 1
    // REGISTER USER - VALID REQUEST
    // =====================================================

    @Test
    void shouldRegisterUser() throws Exception {

        AuthResponse response =
                mock(AuthResponse.class);

        when(authService.register(
                any(RegisterRequest.class)
        )).thenReturn(response);


        String requestJson = """
                {
                    "name": "Mannat",
                    "email": "mannat@example.com",
                    "password": "Password@123",
                    "phoneNumber": "9876543210",
                    "role": "DONOR"
                }
                """;


        mockMvc.perform(
                        post("/api/auth/register")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(requestJson)
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                authService,
                times(1)
        ).register(
                any(RegisterRequest.class)
        );
    }


    // =====================================================
    // TEST 2
    // LOGIN USER - VALID REQUEST
    // =====================================================

    @Test
    void shouldLoginUser() throws Exception {

        AuthResponse response =
                mock(AuthResponse.class);

        when(authService.login(
                any(LoginRequest.class)
        )).thenReturn(response);


        String requestJson = """
                {
                    "email": "mannat@example.com",
                    "password": "Password@123"
                }
                """;


        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(requestJson)
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                authService,
                times(1)
        ).login(
                any(LoginRequest.class)
        );
    }


    // =====================================================
    // TEST 3
    // REGISTER USER - INVALID REQUEST
    // =====================================================

    @Test
    void shouldRejectInvalidRegisterRequest()
            throws Exception {

        String requestJson = """
                {
                    "name": "",
                    "email": "",
                    "password": "",
                    "phoneNumber": "",
                    "role": null
                }
                """;


        mockMvc.perform(
                        post("/api/auth/register")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(requestJson)
                )
                .andExpect(
                        status().isBadRequest()
                );


        verify(
                authService,
                never()
        ).register(
                any(RegisterRequest.class)
        );
    }


    // =====================================================
    // TEST 4
    // LOGIN USER - INVALID REQUEST
    // =====================================================

    @Test
    void shouldRejectInvalidLoginRequest()
            throws Exception {

        String requestJson = """
                {
                    "email": "",
                    "password": ""
                }
                """;


        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(requestJson)
                )
                .andExpect(
                        status().isBadRequest()
                );


        verify(
                authService,
                never()
        ).login(
                any(LoginRequest.class)
        );
    }
}