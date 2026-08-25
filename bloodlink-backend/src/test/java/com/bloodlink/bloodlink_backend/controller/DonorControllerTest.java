package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.DonorProfileRequest;
import com.bloodlink.bloodlink_backend.dto.DonorResponse;
import com.bloodlink.bloodlink_backend.exception.GlobalExceptionHandler;
import com.bloodlink.bloodlink_backend.service.DonorService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(MockitoExtension.class)
class DonorControllerTest {

    @Mock
    private DonorService donorService;

    @InjectMocks
    private DonorController donorController;

    private MockMvc mockMvc;

    private UUID userId;

    private LocalValidatorFactoryBean validator;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders
                .standaloneSetup(donorController)
                .setControllerAdvice(
                        new GlobalExceptionHandler()
                )
                .setValidator(validator)
                .build();

        userId = UUID.randomUUID();
    }


    // =====================================================
    // TEST 1
    // CREATE DONOR PROFILE
    // =====================================================

    @Test
    void shouldCreateDonorProfile() throws Exception {

        DonorResponse response =
                mock(DonorResponse.class);

        when(
                donorService.createProfile(
                        eq(userId),
                        any(DonorProfileRequest.class)
                )
        ).thenReturn(response);


        String requestJson = """
                {
                    "bloodGroup": "A_POSITIVE",
                    "gender": "MALE",
                    "dateOfBirth": "2000-01-01",
                    "weight": 65.0,
                    "city": "Jaipur",
                    "state": "Rajasthan",
                    "pincode": "302001",
                    "latitude": 26.9124,
                    "longitude": 75.7873
                }
                """;


        mockMvc.perform(
                        post("/api/donors/{userId}", userId)
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(requestJson)
                )
                .andExpect(
                        status().isCreated()
                );


        verify(
                donorService,
                times(1)
        ).createProfile(
                eq(userId),
                any(DonorProfileRequest.class)
        );
    }


    // =====================================================
    // TEST 2
    // GET DONOR PROFILE
    // =====================================================

    @Test
    void shouldGetDonorProfile() throws Exception {

        DonorResponse response =
                mock(DonorResponse.class);


        when(
                donorService.getProfile(userId)
        ).thenReturn(response);


        mockMvc.perform(
                        get(
                                "/api/donors/{userId}",
                                userId
                        )
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                donorService,
                times(1)
        ).getProfile(userId);
    }


    // =====================================================
    // TEST 3
    // UPDATE DONOR PROFILE
    // =====================================================

    @Test
    void shouldUpdateDonorProfile() throws Exception {

        DonorResponse response =
                mock(DonorResponse.class);


        when(
                donorService.updateProfile(
                        eq(userId),
                        any(DonorProfileRequest.class)
                )
        ).thenReturn(response);


        String requestJson = """
                {
                    "bloodGroup": "A_POSITIVE",
                    "gender": "MALE",
                    "dateOfBirth": "2000-01-01",
                    "weight": 70.0,
                    "city": "Jaipur",
                    "state": "Rajasthan",
                    "pincode": "302001",
                    "latitude": 26.9124,
                    "longitude": 75.7873
                }
                """;


        mockMvc.perform(
                        put("/api/donors/{userId}", userId)
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(requestJson)
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                donorService,
                times(1)
        ).updateProfile(
                eq(userId),
                any(DonorProfileRequest.class)
        );
    }


    // =====================================================
    // TEST 4
    // INVALID DONOR PROFILE
    // =====================================================

    @Test
    void shouldRejectInvalidDonorProfile()
            throws Exception {

        String invalidJson = """
                {
                    "bloodGroup": null,
                    "gender": null,
                    "weight": -5
                }
                """;


        mockMvc.perform(
                        post(
                                "/api/donors/{userId}",
                                userId
                        )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(invalidJson)
                )
                .andExpect(
                        status().isBadRequest()
                );


        verify(
                donorService,
                never()
        ).createProfile(
                any(UUID.class),
                any(DonorProfileRequest.class)
        );
    }


    // =====================================================
    // TEST 5
    // INVALID UPDATE DONOR PROFILE
    // =====================================================

    @Test
    void shouldRejectInvalidDonorProfileUpdate()
            throws Exception {

        String invalidJson = """
                {
                    "bloodGroup": null,
                    "gender": null,
                    "weight": -10
                }
                """;


        mockMvc.perform(
                        put(
                                "/api/donors/{userId}",
                                userId
                        )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(invalidJson)
                )
                .andExpect(
                        status().isBadRequest()
                );


        verify(
                donorService,
                never()
        ).updateProfile(
                any(UUID.class),
                any(DonorProfileRequest.class)
        );
    }
}