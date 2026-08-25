package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.BloodRequestDto;
import com.bloodlink.bloodlink_backend.dto.BloodResponse;
import com.bloodlink.bloodlink_backend.exception.GlobalExceptionHandler;
import com.bloodlink.bloodlink_backend.service.BloodRequestService;

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

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(MockitoExtension.class)
class BloodRequestControllerTest {

    @Mock
    private BloodRequestService bloodRequestService;

    @InjectMocks
    private BloodRequestController bloodRequestController;

    private MockMvc mockMvc;

    private UUID requestId;

    private LocalValidatorFactoryBean validator;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders
                .standaloneSetup(bloodRequestController)
                .setControllerAdvice(
                        new GlobalExceptionHandler()
                )
                .setValidator(validator)
                .build();

        requestId = UUID.randomUUID();
    }


    // =====================================================
    // TEST 1
    // CREATE BLOOD REQUEST
    // =====================================================

    @Test
    void shouldCreateBloodRequest() throws Exception {

        BloodResponse response =
                new BloodResponse();

        when(
                bloodRequestService.createRequest(
                        any(BloodRequestDto.class)
                )
        ).thenReturn(response);


        String requestJson = """
                {
                    "patientId": "11111111-1111-1111-1111-111111111111",
                    "hospitalId": "22222222-2222-2222-2222-222222222222",
                    "bloodGroup": "A_POSITIVE",
                    "unitsRequired": 2,
                    "emergencyType": "SURGERY",
                    "priority": "NORMAL",
                    "reason": "Blood required",
                    "requiredBefore": "2026-08-25T18:00:00"
                }
                """;


        mockMvc.perform(
                        post("/api/blood-request")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(requestJson)
                )
                .andDo(print())
                .andExpect(
                        status().isOk()
                );


        verify(
                bloodRequestService,
                times(1)
        ).createRequest(
                any(BloodRequestDto.class)
        );
    }


    // =====================================================
    // TEST 2
    // GET BLOOD REQUEST
    // =====================================================

    @Test
    void shouldGetBloodRequest() throws Exception {

        BloodResponse response =
                new BloodResponse();

        when(
                bloodRequestService.getRequest(requestId)
        ).thenReturn(response);


        mockMvc.perform(
                        get(
                                "/api/blood-request/{id}",
                                requestId
                        )
                )
                .andDo(print())
                .andExpect(
                        status().isOk()
                );


        verify(
                bloodRequestService,
                times(1)
        ).getRequest(requestId);
    }


    // =====================================================
    // TEST 3
    // GET PENDING REQUESTS
    // =====================================================

    @Test
    void shouldGetPendingRequests() throws Exception {

        BloodResponse response1 =
                new BloodResponse();

        BloodResponse response2 =
                new BloodResponse();


        when(
                bloodRequestService.getPendingRequests()
        ).thenReturn(
                List.of(response1, response2)
        );


        mockMvc.perform(
                        get("/api/blood-request/pending")
                )
                .andDo(print())
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.length()").value(2)
                );


        verify(
                bloodRequestService,
                times(1)
        ).getPendingRequests();
    }


    // =====================================================
    // TEST 4
    // NO PENDING REQUESTS
    // =====================================================

    @Test
    void shouldReturnEmptyPendingRequests()
            throws Exception {

        when(
                bloodRequestService.getPendingRequests()
        ).thenReturn(
                List.of()
        );


        mockMvc.perform(
                        get("/api/blood-request/pending")
                )
                .andDo(print())
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.length()").value(0)
                );


        verify(
                bloodRequestService,
                times(1)
        ).getPendingRequests();
    }


    // =====================================================
    // TEST 5
    // CANCEL BLOOD REQUEST
    // =====================================================

    @Test
    void shouldCancelBloodRequest() throws Exception {

        BloodResponse response =
                new BloodResponse();

        when(
                bloodRequestService.cancelRequest(requestId)
        ).thenReturn(response);


        mockMvc.perform(
                        delete(
                                "/api/blood-request/{id}",
                                requestId
                        )
                )
                .andDo(print())
                .andExpect(
                        status().isOk()
                );


        verify(
                bloodRequestService,
                times(1)
        ).cancelRequest(requestId);
    }


    // =====================================================
    // TEST 6
    // INVALID BLOOD REQUEST
    // =====================================================

    @Test
    void shouldRejectInvalidBloodRequest()
            throws Exception {

        String invalidJson = """
                {
                    "patientId": null,
                    "hospitalId": null,
                    "bloodGroup": null,
                    "unitsRequired": 0,
                    "emergencyType": null,
                    "priority": null,
                    "reason": "",
                    "requiredBefore": null
                }
                """;


        mockMvc.perform(
                        post("/api/blood-request")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(invalidJson)
                )
                .andDo(print())
                .andExpect(
                        status().isBadRequest()
                );


        verify(
                bloodRequestService,
                never()
        ).createRequest(
                any(BloodRequestDto.class)
        );
    }


    // =====================================================
    // TEST 7
    // ZERO UNITS
    // =====================================================

    @Test
    void shouldRejectZeroUnits()
            throws Exception {

        String invalidJson = """
                {
                    "patientId": "11111111-1111-1111-1111-111111111111",
                    "hospitalId": "22222222-2222-2222-2222-222222222222",
                    "bloodGroup": "A_POSITIVE",
                    "unitsRequired": 0,
                    "emergencyType": "SURGERY",
                    "priority": "NORMAL",
                    "reason": "Blood required",
                    "requiredBefore": "2026-08-25T18:00:00"
                }
                """;


        mockMvc.perform(
                        post("/api/blood-request")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(invalidJson)
                )
                .andDo(print())
                .andExpect(
                        status().isBadRequest()
                );


        verify(
                bloodRequestService,
                never()
        ).createRequest(
                any(BloodRequestDto.class)
        );
    }
}