package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.EmergencyType;
import com.bloodlink.bloodlink_backend.Enum.RequestPriority;
import com.bloodlink.bloodlink_backend.Enum.RequestStatus;
import com.bloodlink.bloodlink_backend.dto.BloodRequestDto;
import com.bloodlink.bloodlink_backend.dto.BloodResponse;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Hospital;
import com.bloodlink.bloodlink_backend.entity.Patient;
import com.bloodlink.bloodlink_backend.repo.BloodRequestRepository;
import com.bloodlink.bloodlink_backend.repo.HospitalRepository;
import com.bloodlink.bloodlink_backend.repo.PatientRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class BloodRequestServiceImplTest {

    @Mock
    private BloodRequestRepository bloodRequestRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private HospitalRepository hospitalRepository;

    @InjectMocks
    private BloodRequestServiceImpl bloodRequestService;

    private UUID patientId;
    private UUID hospitalId;
    private UUID requestId;

    private Patient patient;
    private Hospital hospital;

    private BloodRequestDto request;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        patientId = UUID.randomUUID();
        hospitalId = UUID.randomUUID();
        requestId = UUID.randomUUID();


        // =========================
        // PATIENT
        // =========================

        patient = new Patient();
        patient.setId(patientId);


        // =========================
        // HOSPITAL
        // =========================

        hospital = new Hospital();
        hospital.setId(hospitalId);


        // =========================
        // REQUEST DTO
        // =========================

        request = new BloodRequestDto();

        request.setPatientId(patientId);
        request.setHospitalId(hospitalId);

        request.setBloodGroup(
                BloodGroup.A_POSITIVE
        );

        request.setUnitsRequired(2);

        request.setEmergencyType(
                EmergencyType.ACCIDENT
        );

        request.setPriority(
                RequestPriority.HIGH
        );

        request.setReason(
                "Blood required"
        );

        request.setRequiredBefore(
                LocalDateTime.now().plusDays(1)
        );
    }


    // =====================================================
    // TEST 1
    // CREATE BLOOD REQUEST
    // =====================================================

    @Test
    void shouldCreateBloodRequest() {

        when(
                patientRepository.findById(patientId)
        ).thenReturn(
                Optional.of(patient)
        );

        when(
                hospitalRepository.findById(hospitalId)
        ).thenReturn(
                Optional.of(hospital)
        );

        when(
                bloodRequestRepository.save(
                        any(BloodRequest.class)
                )
        ).thenAnswer(invocation -> {

            BloodRequest savedRequest =
                    invocation.getArgument(0);

            savedRequest.setId(requestId);

            return savedRequest;
        });


        BloodResponse response =
                bloodRequestService.createRequest(
                        request
                );


        assertNotNull(response);

        assertEquals(
                requestId,
                response.getRequestId()
        );

        assertEquals(
                RequestStatus.PENDING,
                response.getStatus()
        );

        assertEquals(
                "Blood Request Created Successfully",
                response.getMessage()
        );


        verify(
                patientRepository,
                times(1)
        ).findById(patientId);

        verify(
                hospitalRepository,
                times(1)
        ).findById(hospitalId);

        verify(
                bloodRequestRepository,
                times(1)
        ).save(any(BloodRequest.class));
    }


    // =====================================================
    // TEST 2
    // PATIENT NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenPatientDoesNotExist() {

        when(
                patientRepository.findById(patientId)
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodRequestService
                                        .createRequest(request)
                );


        assertEquals(
                "Patient not found",
                exception.getMessage()
        );


        verify(
                hospitalRepository,
                never()
        ).findById(any(UUID.class));

        verify(
                bloodRequestRepository,
                never()
        ).save(any(BloodRequest.class));
    }


    // =====================================================
    // TEST 3
    // HOSPITAL NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenHospitalDoesNotExist() {

        when(
                patientRepository.findById(patientId)
        ).thenReturn(
                Optional.of(patient)
        );

        when(
                hospitalRepository.findById(hospitalId)
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodRequestService
                                        .createRequest(request)
                );


        assertEquals(
                "Hospital not found",
                exception.getMessage()
        );


        verify(
                bloodRequestRepository,
                never()
        ).save(any(BloodRequest.class));
    }


    // =====================================================
    // TEST 4
    // ZERO UNITS
    // =====================================================

    @Test
    void shouldRejectZeroUnits() {

        request.setUnitsRequired(0);


        when(
                patientRepository.findById(patientId)
        ).thenReturn(
                Optional.of(patient)
        );

        when(
                hospitalRepository.findById(hospitalId)
        ).thenReturn(
                Optional.of(hospital)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodRequestService
                                        .createRequest(request)
                );


        assertEquals(
                "Units must be greater than 0",
                exception.getMessage()
        );


        verify(
                bloodRequestRepository,
                never()
        ).save(any(BloodRequest.class));
    }


    // =====================================================
    // TEST 5
    // MORE THAN 10 UNITS
    // =====================================================

    @Test
    void shouldRejectMoreThanTenUnits() {

        request.setUnitsRequired(11);


        when(
                patientRepository.findById(patientId)
        ).thenReturn(
                Optional.of(patient)
        );

        when(
                hospitalRepository.findById(hospitalId)
        ).thenReturn(
                Optional.of(hospital)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodRequestService
                                        .createRequest(request)
                );


        assertEquals(
                "Maximum 10 units allowed",
                exception.getMessage()
        );


        verify(
                bloodRequestRepository,
                never()
        ).save(any(BloodRequest.class));
    }


    // =====================================================
    // TEST 6
    // REQUIRED TIME IN PAST
    // =====================================================

    @Test
    void shouldRejectPastRequiredTime() {

        request.setRequiredBefore(
                LocalDateTime.now().minusHours(1)
        );


        when(
                patientRepository.findById(patientId)
        ).thenReturn(
                Optional.of(patient)
        );

        when(
                hospitalRepository.findById(hospitalId)
        ).thenReturn(
                Optional.of(hospital)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodRequestService
                                        .createRequest(request)
                );


        assertEquals(
                "Required time must be in future",
                exception.getMessage()
        );


        verify(
                bloodRequestRepository,
                never()
        ).save(any(BloodRequest.class));
    }


    // =====================================================
    // TEST 7
    // GET BLOOD REQUEST
    // =====================================================

    @Test
    void shouldGetBloodRequest() {

        BloodRequest bloodRequest =
                new BloodRequest();

        bloodRequest.setId(requestId);

        bloodRequest.setStatus(
                RequestStatus.PENDING
        );


        when(
                bloodRequestRepository.findById(requestId)
        ).thenReturn(
                Optional.of(bloodRequest)
        );


        BloodResponse response =
                bloodRequestService.getRequest(
                        requestId
                );


        assertNotNull(response);

        assertEquals(
                requestId,
                response.getRequestId()
        );

        assertEquals(
                RequestStatus.PENDING,
                response.getStatus()
        );

        assertEquals(
                "Blood Request Found",
                response.getMessage()
        );


        verify(
                bloodRequestRepository,
                times(1)
        ).findById(requestId);
    }


    // =====================================================
    // TEST 8
    // GET REQUEST NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenBloodRequestDoesNotExist() {

        when(
                bloodRequestRepository.findById(requestId)
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodRequestService
                                        .getRequest(requestId)
                );


        assertEquals(
                "Blood Request Not Found",
                exception.getMessage()
        );
    }


    // =====================================================
    // TEST 9
    // GET PENDING REQUESTS
    // =====================================================

    @Test
    void shouldGetPendingRequests() {

        BloodRequest request1 =
                new BloodRequest();

        request1.setId(UUID.randomUUID());
        request1.setStatus(
                RequestStatus.PENDING
        );


        BloodRequest request2 =
                new BloodRequest();

        request2.setId(UUID.randomUUID());
        request2.setStatus(
                RequestStatus.PENDING
        );


        when(
                bloodRequestRepository.findByStatus(
                        RequestStatus.PENDING
                )
        ).thenReturn(
                List.of(request1, request2)
        );


        List<BloodResponse> responses =
                bloodRequestService
                        .getPendingRequests();


        assertNotNull(responses);

        assertEquals(
                2,
                responses.size()
        );


        assertEquals(
                RequestStatus.PENDING,
                responses.get(0).getStatus()
        );


        assertEquals(
                "Pending Request",
                responses.get(0).getMessage()
        );


        verify(
                bloodRequestRepository,
                times(1)
        ).findByStatus(
                RequestStatus.PENDING
        );
    }


    // =====================================================
    // TEST 10
    // EMPTY PENDING REQUESTS
    // =====================================================

    @Test
    void shouldReturnEmptyPendingRequests() {

        when(
                bloodRequestRepository.findByStatus(
                        RequestStatus.PENDING
                )
        ).thenReturn(
                List.of()
        );


        List<BloodResponse> responses =
                bloodRequestService
                        .getPendingRequests();


        assertNotNull(responses);

        assertTrue(
                responses.isEmpty()
        );


        verify(
                bloodRequestRepository,
                times(1)
        ).findByStatus(
                RequestStatus.PENDING
        );
    }


    // =====================================================
    // TEST 11
    // CANCEL BLOOD REQUEST
    // =====================================================

    @Test
    void shouldCancelBloodRequest() {

        BloodRequest bloodRequest =
                new BloodRequest();

        bloodRequest.setId(requestId);

        bloodRequest.setStatus(
                RequestStatus.PENDING
        );


        when(
                bloodRequestRepository.findById(requestId)
        ).thenReturn(
                Optional.of(bloodRequest)
        );


        when(
                bloodRequestRepository.save(
                        any(BloodRequest.class)
                )
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        BloodResponse response =
                bloodRequestService
                        .cancelRequest(requestId);


        assertNotNull(response);

        assertEquals(
                requestId,
                response.getRequestId()
        );

        assertEquals(
                RequestStatus.CANCELLED,
                response.getStatus()
        );

        assertEquals(
                "Blood Request Cancelled Successfully",
                response.getMessage()
        );


        assertEquals(
                RequestStatus.CANCELLED,
                bloodRequest.getStatus()
        );


        verify(
                bloodRequestRepository,
                times(1)
        ).findById(requestId);

        verify(
                bloodRequestRepository,
                times(1)
        ).save(bloodRequest);
    }


    // =====================================================
    // TEST 12
    // CANCEL REQUEST NOT FOUND
    // =====================================================

    @Test
    void shouldRejectCancelWhenRequestDoesNotExist() {

        when(
                bloodRequestRepository.findById(requestId)
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                bloodRequestService
                                        .cancelRequest(requestId)
                );


        assertEquals(
                "Blood Request Not Found",
                exception.getMessage()
        );


        verify(
                bloodRequestRepository,
                never()
        ).save(any(BloodRequest.class));
    }
}