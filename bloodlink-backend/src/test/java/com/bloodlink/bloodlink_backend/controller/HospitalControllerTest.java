package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.HospitalRequest;
import com.bloodlink.bloodlink_backend.dto.HospitalResponse;
import com.bloodlink.bloodlink_backend.exception.GlobalExceptionHandler;
import com.bloodlink.bloodlink_backend.service.HospitalService;

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
class HospitalControllerTest {

    @Mock
    private HospitalService hospitalService;

    @InjectMocks
    private HospitalController hospitalController;

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
                .standaloneSetup(hospitalController)
                .setControllerAdvice(
                        new GlobalExceptionHandler()
                )
                .setValidator(validator)
                .build();

        userId = UUID.randomUUID();
    }


    // =====================================================
    // TEST 1
    // CREATE HOSPITAL PROFILE
    // =====================================================

    @Test
    void shouldCreateHospitalProfile()
            throws Exception {

        HospitalResponse response =
                mock(HospitalResponse.class);

        when(
                hospitalService.createProfile(
                        eq(userId),
                        any(HospitalRequest.class)
                )
        ).thenReturn(response);


        String requestJson = """
                {
                    "hospitalName": "City Hospital",
                    "registrationNumber": "HOSP-001",
                    "contactPerson": "Rahul Sharma",
                    "contactPhone": "9876543210",
                    "city": "Jaipur",
                    "state": "Rajasthan",
                    "pincode": "302001",
                    "latitude": 26.9124,
                    "longitude": 75.7873
                }
                """;


        mockMvc.perform(
                        post(
                                "/api/hospital/{userId}",
                                userId
                        )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(requestJson)
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                hospitalService,
                times(1)
        ).createProfile(
                eq(userId),
                any(HospitalRequest.class)
        );
    }


    // =====================================================
    // TEST 2
    // GET HOSPITAL PROFILE
    // =====================================================

    @Test
    void shouldGetHospitalProfile()
            throws Exception {

        HospitalResponse response =
                mock(HospitalResponse.class);

        when(
                hospitalService.getProfile(userId)
        ).thenReturn(response);


        mockMvc.perform(
                        get(
                                "/api/hospital/{userId}",
                                userId
                        )
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                hospitalService,
                times(1)
        ).getProfile(userId);
    }


    // =====================================================
    // TEST 3
    // UPDATE HOSPITAL PROFILE
    // =====================================================

    @Test
    void shouldUpdateHospitalProfile()
            throws Exception {

        HospitalResponse response =
                mock(HospitalResponse.class);

        when(
                hospitalService.updateProfile(
                        eq(userId),
                        any(HospitalRequest.class)
                )
        ).thenReturn(response);


        String requestJson = """
                {
                    "hospitalName": "Updated City Hospital",
                    "registrationNumber": "HOSP-001",
                    "contactPerson": "Amit Sharma",
                    "contactPhone": "9876543210",
                    "city": "Jaipur",
                    "state": "Rajasthan",
                    "pincode": "302001",
                    "latitude": 26.9124,
                    "longitude": 75.7873
                }
                """;


        mockMvc.perform(
                        put(
                                "/api/hospital/{userId}",
                                userId
                        )
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(requestJson)
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                hospitalService,
                times(1)
        ).updateProfile(
                eq(userId),
                any(HospitalRequest.class)
        );
    }


    // =====================================================
    // TEST 4
    // INVALID CREATE
    // =====================================================

    @Test
    void shouldRejectInvalidHospitalProfile()
            throws Exception {

        String invalidJson = """
                {
                    "hospitalName": "",
                    "registrationNumber": "",
                    "contactPerson": "",
                    "contactPhone": "",
                    "city": "",
                    "state": "",
                    "pincode": "",
                    "latitude": null,
                    "longitude": null
                }
                """;


        mockMvc.perform(
                        post(
                                "/api/hospital/{userId}",
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
                hospitalService,
                never()
        ).createProfile(
                any(UUID.class),
                any(HospitalRequest.class)
        );
    }


    // =====================================================
    // TEST 5
    // INVALID UPDATE
    // =====================================================

    @Test
    void shouldRejectInvalidHospitalProfileUpdate()
            throws Exception {

        String invalidJson = """
                {
                    "hospitalName": "",
                    "registrationNumber": "",
                    "contactPerson": "",
                    "contactPhone": "",
                    "city": "",
                    "state": "",
                    "pincode": "",
                    "latitude": null,
                    "longitude": null
                }
                """;


        mockMvc.perform(
                        put(
                                "/api/hospital/{userId}",
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
                hospitalService,
                never()
        ).updateProfile(
                any(UUID.class),
                any(HospitalRequest.class)
        );
    }
}