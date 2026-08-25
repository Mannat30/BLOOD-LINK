package com.bloodlink.bloodlink_backend.controller;

import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.exception.ResourceNotFoundException;
import com.bloodlink.bloodlink_backend.repo.BloodRequestRepository;
import com.bloodlink.bloodlink_backend.service.MatchingService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;

import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(MockitoExtension.class)
class MatchingControllerTest {

    @Mock
    private MatchingService matchingService;

    @Mock
    private BloodRequestRepository bloodRequestRepository;

    @InjectMocks
    private MatchingController matchingController;

    private MockMvc mockMvc;

    private UUID requestId;

    private BloodRequest bloodRequest;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        mockMvc = MockMvcBuilders
                .standaloneSetup(matchingController)
                .build();

        requestId = UUID.randomUUID();

        bloodRequest = new BloodRequest();
    }


    // =====================================================
    // TEST 1
    // GET ELIGIBLE DONORS
    // =====================================================

    @Test
    void shouldReturnEligibleDonors()
            throws Exception {

        Donor donor = new Donor();


        when(
                bloodRequestRepository.findById(
                        requestId
                )
        ).thenReturn(
                Optional.of(bloodRequest)
        );


        when(
                matchingService.findEligibleDonors(
                        bloodRequest
                )
        ).thenReturn(
                List.of(donor)
        );


        mockMvc.perform(
                        get(
                                "/api/matching/eligible/{requestId}",
                                requestId
                        )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.length()")
                                .value(1)
                );


        verify(
                bloodRequestRepository,
                times(1)
        ).findById(requestId);


        verify(
                matchingService,
                times(1)
        ).findEligibleDonors(
                bloodRequest
        );
    }


    // =====================================================
    // TEST 2
    // NO ELIGIBLE DONORS
    // =====================================================

    @Test
    void shouldReturnEmptyListWhenNoEligibleDonors()
            throws Exception {

        when(
                bloodRequestRepository.findById(
                        requestId
                )
        ).thenReturn(
                Optional.of(bloodRequest)
        );


        when(
                matchingService.findEligibleDonors(
                        bloodRequest
                )
        ).thenReturn(
                List.of()
        );


        mockMvc.perform(
                        get(
                                "/api/matching/eligible/{requestId}",
                                requestId
                        )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.length()")
                                .value(0)
                );


        verify(
                bloodRequestRepository,
                times(1)
        ).findById(requestId);


        verify(
                matchingService,
                times(1)
        ).findEligibleDonors(
                bloodRequest
        );
    }


    // =====================================================
    // TEST 3
    // REQUEST NOT FOUND
    // =====================================================

    @Test
    void shouldFailWhenBloodRequestDoesNotExist() {

        when(
                bloodRequestRepository.findById(
                        requestId
                )
        ).thenReturn(
                Optional.empty()
        );


        assertThrows(
                ResourceNotFoundException.class,
                () ->
                        matchingController
                                .findEligibleDonors(
                                        requestId
                                )
        );


        verify(
                bloodRequestRepository,
                times(1)
        ).findById(requestId);


        verify(
                matchingService,
                never()
        ).findEligibleDonors(any());
    }


    // =====================================================
    // TEST 4
    // RANK DONORS
    // =====================================================

    @Test
    void shouldRankDonors()
            throws Exception {

        when(
                bloodRequestRepository.findById(
                        requestId
                )
        ).thenReturn(
                Optional.of(bloodRequest)
        );


        when(
                matchingService.rankDonors(
                        bloodRequest
                )
        ).thenReturn(
                List.of()
        );


        mockMvc.perform(
                        post(
                                "/api/matching/rank/{requestId}",
                                requestId
                        )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.length()")
                                .value(0)
                );


        verify(
                bloodRequestRepository,
                times(1)
        ).findById(requestId);


        verify(
                matchingService,
                times(1)
        ).rankDonors(
                bloodRequest
        );
    }


    // =====================================================
    // TEST 5
    // RANKING REQUEST NOT FOUND
    // =====================================================

    @Test
    void shouldFailRankingWhenBloodRequestDoesNotExist() {

        when(
                bloodRequestRepository.findById(
                        requestId
                )
        ).thenReturn(
                Optional.empty()
        );


        assertThrows(
                ResourceNotFoundException.class,
                () ->
                        matchingController
                                .rankDonors(
                                        requestId
                                )
        );


        verify(
                bloodRequestRepository,
                times(1)
        ).findById(requestId);


        verify(
                matchingService,
                never()
        ).rankDonors(any());
    }


    // =====================================================
    // TEST 6
    // MULTIPLE ELIGIBLE DONORS
    // =====================================================

    @Test
    void shouldReturnMultipleEligibleDonors()
            throws Exception {

        Donor donor1 = new Donor();
        Donor donor2 = new Donor();
        Donor donor3 = new Donor();


        when(
                bloodRequestRepository.findById(
                        requestId
                )
        ).thenReturn(
                Optional.of(bloodRequest)
        );


        when(
                matchingService.findEligibleDonors(
                        bloodRequest
                )
        ).thenReturn(
                List.of(
                        donor1,
                        donor2,
                        donor3
                )
        );


        mockMvc.perform(
                        get(
                                "/api/matching/eligible/{requestId}",
                                requestId
                        )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.length()")
                                .value(3)
                );


        verify(
                matchingService,
                times(1)
        ).findEligibleDonors(
                bloodRequest
        );
    }
}