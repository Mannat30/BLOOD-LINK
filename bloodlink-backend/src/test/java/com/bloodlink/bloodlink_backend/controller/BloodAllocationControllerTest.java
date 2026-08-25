package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.BloodAllocationRequest;
import com.bloodlink.bloodlink_backend.dto.BloodAllocationResponse;
import com.bloodlink.bloodlink_backend.exception.GlobalExceptionHandler;
import com.bloodlink.bloodlink_backend.service.BloodAllocationService;

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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(MockitoExtension.class)
class BloodAllocationControllerTest {

    @Mock
    private BloodAllocationService bloodAllocationService;

    @InjectMocks
    private BloodAllocationController bloodAllocationController;

    private MockMvc mockMvc;

    private UUID donationId;

    private UUID allocationId;

    private LocalValidatorFactoryBean validator;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders
                .standaloneSetup(bloodAllocationController)
                .setControllerAdvice(
                        new GlobalExceptionHandler()
                )
                .setValidator(validator)
                .build();

        donationId = UUID.randomUUID();

        allocationId = UUID.randomUUID();
    }


    // =====================================================
    // TEST 1
    // ALLOCATE BLOOD
    // =====================================================

    @Test
    void shouldAllocateBlood()
            throws Exception {

        BloodAllocationResponse response =
                mock(BloodAllocationResponse.class);

        when(
                bloodAllocationService.allocateBlood(
                        eq(donationId),
                        any(BloodAllocationRequest.class)
                )
        ).thenReturn(response);


        String requestJson = """
                {
                    "allocatedUnits": 2
                }
                """;


        mockMvc.perform(
                        post(
                                "/blood-allocation/{donationId}",
                                donationId
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
                bloodAllocationService,
                times(1)
        ).allocateBlood(
                eq(donationId),
                any(BloodAllocationRequest.class)
        );
    }


    // =====================================================
    // TEST 2
    // GET ALL ALLOCATIONS
    // =====================================================

    @Test
    void shouldGetAllAllocations()
            throws Exception {

        BloodAllocationResponse response1 =
                mock(BloodAllocationResponse.class);

        BloodAllocationResponse response2 =
                mock(BloodAllocationResponse.class);


        when(
                bloodAllocationService.getAllAllocations()
        ).thenReturn(
                List.of(response1, response2)
        );


        mockMvc.perform(
                        get("/blood-allocation")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.length()").value(2)
                );


        verify(
                bloodAllocationService,
                times(1)
        ).getAllAllocations();
    }


    // =====================================================
    // TEST 3
    // GET ONE ALLOCATION
    // =====================================================

    @Test
    void shouldGetOneAllocation()
            throws Exception {

        BloodAllocationResponse response =
                mock(BloodAllocationResponse.class);


        when(
                bloodAllocationService.getAllocation(
                        allocationId
                )
        ).thenReturn(response);


        mockMvc.perform(
                        get(
                                "/blood-allocation/{id}",
                                allocationId
                        )
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                bloodAllocationService,
                times(1)
        ).getAllocation(allocationId);
    }


    // =====================================================
    // TEST 4
    // ZERO UNITS SHOULD BE REJECTED
    // =====================================================

    @Test
    void shouldRejectZeroUnits()
            throws Exception {

        String invalidJson = """
                {
                    "allocatedUnits": 0
                }
                """;


        mockMvc.perform(
                        post(
                                "/blood-allocation/{donationId}",
                                donationId
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
                bloodAllocationService,
                never()
        ).allocateBlood(
                any(UUID.class),
                any(BloodAllocationRequest.class)
        );
    }


    // =====================================================
    // TEST 5
    // NULL UNITS SHOULD BE REJECTED
    // =====================================================

    @Test
    void shouldRejectNullUnits()
            throws Exception {

        String invalidJson = """
                {
                    "allocatedUnits": null
                }
                """;


        mockMvc.perform(
                        post(
                                "/blood-allocation/{donationId}",
                                donationId
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
                bloodAllocationService,
                never()
        ).allocateBlood(
                any(UUID.class),
                any(BloodAllocationRequest.class)
        );
    }
}