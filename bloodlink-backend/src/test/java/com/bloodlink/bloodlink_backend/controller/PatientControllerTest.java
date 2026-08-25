package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.PatientRequest;
import com.bloodlink.bloodlink_backend.dto.PatientResponse;
import com.bloodlink.bloodlink_backend.exception.GlobalExceptionHandler;
import com.bloodlink.bloodlink_backend.service.PatientService;

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
class PatientControllerTest {

    @Mock
    private PatientService patientService;

    @InjectMocks
    private PatientController patientController;

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
                .standaloneSetup(patientController)
                .setControllerAdvice(
                        new GlobalExceptionHandler()
                )
                .setValidator(validator)
                .build();

        userId = UUID.randomUUID();
    }


    // =====================================================
    // TEST 1
    // CREATE PATIENT PROFILE
    // =====================================================

    @Test
    void shouldCreatePatientProfile()
            throws Exception {

        PatientResponse response =
                mock(PatientResponse.class);

        when(
                patientService.createProfile(
                        eq(userId),
                        any(PatientRequest.class)
                )
        ).thenReturn(response);


        String requestJson = """
                {
                    "bloodGroup": "A_POSITIVE",
                    "gender": "MALE",
                    "dateOfBirth": "2000-01-01",
                    "medicalCondition": "Healthy",
                    "emergencyContactAvailable": true
                }
                """;


        mockMvc.perform(
                        post(
                                "/api/patient/{userId}",
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
                patientService,
                times(1)
        ).createProfile(
                eq(userId),
                any(PatientRequest.class)
        );
    }


    // =====================================================
    // TEST 2
    // GET PATIENT PROFILE
    // =====================================================

    @Test
    void shouldGetPatientProfile()
            throws Exception {

        PatientResponse response =
                mock(PatientResponse.class);

        when(
                patientService.getProfile(userId)
        ).thenReturn(response);


        mockMvc.perform(
                        get(
                                "/api/patient/{userId}",
                                userId
                        )
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                patientService,
                times(1)
        ).getProfile(userId);
    }


    // =====================================================
    // TEST 3
    // UPDATE PATIENT PROFILE
    // =====================================================

    @Test
    void shouldUpdatePatientProfile()
            throws Exception {

        PatientResponse response =
                mock(PatientResponse.class);

        when(
                patientService.updateProfile(
                        eq(userId),
                        any(PatientRequest.class)
                )
        ).thenReturn(response);


        String requestJson = """
                {
                    "bloodGroup": "A_POSITIVE",
                    "gender": "MALE",
                    "dateOfBirth": "2000-01-01",
                    "medicalCondition": "Healthy",
                    "emergencyContactAvailable": true
                }
                """;


        mockMvc.perform(
                        put(
                                "/api/patient/{userId}",
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
                patientService,
                times(1)
        ).updateProfile(
                eq(userId),
                any(PatientRequest.class)
        );
    }


    // =====================================================
    // TEST 4
    // INVALID CREATE
    // =====================================================

    @Test
    void shouldRejectInvalidPatientProfile()
            throws Exception {

        String invalidJson = """
                {
                    "bloodGroup": null,
                    "gender": null,
                    "dateOfBirth": null,
                    "medicalCondition": "",
                    "emergencyContactAvailable": null
                }
                """;


        mockMvc.perform(
                        post(
                                "/api/patient/{userId}",
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
                patientService,
                never()
        ).createProfile(
                any(UUID.class),
                any(PatientRequest.class)
        );
    }


    // =====================================================
    // TEST 5
    // INVALID UPDATE
    // =====================================================

    @Test
    void shouldRejectInvalidPatientProfileUpdate()
            throws Exception {

        String invalidJson = """
                {
                    "bloodGroup": null,
                    "gender": null,
                    "dateOfBirth": null,
                    "medicalCondition": "",
                    "emergencyContactAvailable": null
                }
                """;


        mockMvc.perform(
                        put(
                                "/api/patient/{userId}",
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
                patientService,
                never()
        ).updateProfile(
                any(UUID.class),
                any(PatientRequest.class)
        );
    }
}