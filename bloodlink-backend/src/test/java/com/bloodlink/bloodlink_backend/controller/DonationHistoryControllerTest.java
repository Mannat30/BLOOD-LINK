package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.dto.DonationHistoryRequest;
import com.bloodlink.bloodlink_backend.dto.DonationHistoryResponse;
import com.bloodlink.bloodlink_backend.exception.GlobalExceptionHandler;
import com.bloodlink.bloodlink_backend.service.DonationHistoryService;

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
class DonationHistoryControllerTest {

    @Mock
    private DonationHistoryService donationHistoryService;

    @InjectMocks
    private DonationHistoryController donationHistoryController;

    private MockMvc mockMvc;

    private UUID notificationId;

    private UUID donationId;

    private LocalValidatorFactoryBean validator;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders
                .standaloneSetup(donationHistoryController)
                .setControllerAdvice(
                        new GlobalExceptionHandler()
                )
                .setValidator(validator)
                .build();

        notificationId = UUID.randomUUID();

        donationId = UUID.randomUUID();
    }


    // =====================================================
    // TEST 1
    // CREATE DONATION
    // =====================================================

    @Test
    void shouldCreateDonation()
            throws Exception {

        DonationHistoryResponse response =
                mock(DonationHistoryResponse.class);

        when(
                donationHistoryService.donate(
                        eq(notificationId),
                        any(DonationHistoryRequest.class)
                )
        ).thenReturn(response);


        String requestJson = """
                {
                    "unitsDonated": 2
                }
                """;


        mockMvc.perform(
                        post(
                                "/donations/{notificationId}",
                                notificationId
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
                donationHistoryService,
                times(1)
        ).donate(
                eq(notificationId),
                any(DonationHistoryRequest.class)
        );
    }


    // =====================================================
    // TEST 2
    // GET ALL DONATIONS
    // =====================================================

    @Test
    void shouldGetAllDonations()
            throws Exception {

        DonationHistoryResponse response1 =
                mock(DonationHistoryResponse.class);

        DonationHistoryResponse response2 =
                mock(DonationHistoryResponse.class);


        when(
                donationHistoryService.getAllDonations()
        ).thenReturn(
                List.of(response1, response2)
        );


        mockMvc.perform(
                        get("/donations")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.length()").value(2)
                );


        verify(
                donationHistoryService,
                times(1)
        ).getAllDonations();
    }


    // =====================================================
    // TEST 3
    // GET ONE DONATION
    // =====================================================

    @Test
    void shouldGetOneDonation()
            throws Exception {

        DonationHistoryResponse response =
                mock(DonationHistoryResponse.class);


        when(
                donationHistoryService.getDonation(donationId)
        ).thenReturn(response);


        mockMvc.perform(
                        get(
                                "/donations/{id}",
                                donationId
                        )
                )
                .andExpect(
                        status().isOk()
                );


        verify(
                donationHistoryService,
                times(1)
        ).getDonation(donationId);
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
                    "unitsDonated": 0
                }
                """;


        mockMvc.perform(
                        post(
                                "/donations/{notificationId}",
                                notificationId
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
                donationHistoryService,
                never()
        ).donate(
                any(UUID.class),
                any(DonationHistoryRequest.class)
        );
    }


    // =====================================================
    // TEST 5
    // NEGATIVE UNITS SHOULD BE REJECTED
    // =====================================================

    @Test
    void shouldRejectNegativeUnits()
            throws Exception {

        String invalidJson = """
                {
                    "unitsDonated": -5
                }
                """;


        mockMvc.perform(
                        post(
                                "/donations/{notificationId}",
                                notificationId
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
                donationHistoryService,
                never()
        ).donate(
                any(UUID.class),
                any(DonationHistoryRequest.class)
        );
    }
}