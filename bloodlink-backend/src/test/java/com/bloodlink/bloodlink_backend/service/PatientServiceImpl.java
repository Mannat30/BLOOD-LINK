package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.Gender;
import com.bloodlink.bloodlink_backend.Enum.Role;
import com.bloodlink.bloodlink_backend.dto.PatientRequest;
import com.bloodlink.bloodlink_backend.dto.PatientResponse;
import com.bloodlink.bloodlink_backend.entity.Patient;
import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.repo.PatientRepository;
import com.bloodlink.bloodlink_backend.repo.Userrepo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class PatientServiceImplTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private Userrepo userRepository;

    @InjectMocks
    private PatientServiceImpl patientService;

    private UUID userId;

    private User user;

    private Patient patient;

    private PatientRequest request;


    // =====================================================
    // SETUP
    // =====================================================

    @BeforeEach
    void setUp() {

        userId = UUID.randomUUID();


        // =========================
        // USER
        // =========================

        user = new User();

        user.setId(userId);
        user.setName("Mannat");
        user.setEmail("mannat@example.com");
        user.setPhoneNumber("9876543210");
        user.setRole(Role.PATIENT);


        // =========================
        // PATIENT REQUEST
        // =========================

        request = new PatientRequest();

        request.setBloodGroup(
                BloodGroup.A_POSITIVE
        );

        request.setGender(
                Gender.MALE
        );

        request.setDateOfBirth(
                LocalDate.of(2000, 1, 1)
        );

        request.setMedicalCondition(
                "Blood disorder"
        );

        request.setEmergencyContactAvailable(
                true
        );


        // =========================
        // PATIENT
        // =========================

        patient = new Patient();

        patient.setUser(user);

        patient.setBloodGroup(
                BloodGroup.A_POSITIVE
        );

        patient.setGender(
                Gender.MALE
        );

        patient.setDateOfBirth(
                LocalDate.of(2000, 1, 1)
        );

        patient.setMedicalCondition(
                "Blood disorder"
        );

        patient.setEmergencyContactAvailable(
                false
        );
    }


    // =====================================================
    // TEST 1
    // CREATE PATIENT PROFILE
    // =====================================================

    @Test
    void shouldCreatePatientProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                patientRepository.existsByUser(user)
        ).thenReturn(false);


        when(
                patientRepository.save(any(Patient.class))
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        PatientResponse response =
                patientService.createProfile(
                        userId,
                        request
                );


        assertNotNull(response);


        assertEquals(
                "Mannat",
                response.getName()
        );


        assertEquals(
                BloodGroup.A_POSITIVE,
                response.getBloodGroup()
        );


        assertEquals(
                "Blood disorder",
                response.getMedicalCondition()
        );


        verify(
                userRepository,
                times(1)
        ).findById(userId);


        verify(
                patientRepository,
                times(1)
        ).existsByUser(user);


        verify(
                patientRepository,
                times(1)
        ).save(any(Patient.class));
    }


    // =====================================================
    // TEST 2
    // USER NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenUserDoesNotExist() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                patientService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "User not found",
                exception.getMessage()
        );


        verify(
                patientRepository,
                never()
        ).existsByUser(any(User.class));


        verify(
                patientRepository,
                never()
        ).save(any(Patient.class));
    }


    // =====================================================
    // TEST 3
    // WRONG ROLE
    // =====================================================

    @Test
    void shouldRejectNonPatientUser() {

        user.setRole(Role.DONOR);


        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                patientService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Only patients can create patient profile",
                exception.getMessage()
        );


        verify(
                patientRepository,
                never()
        ).existsByUser(any(User.class));


        verify(
                patientRepository,
                never()
        ).save(any(Patient.class));
    }


    // =====================================================
    // TEST 4
    // DUPLICATE PATIENT PROFILE
    // =====================================================

    @Test
    void shouldRejectDuplicatePatientProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                patientRepository.existsByUser(user)
        ).thenReturn(true);


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                patientService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Patient profile already exists",
                exception.getMessage()
        );


        verify(
                patientRepository,
                times(1)
        ).existsByUser(user);


        verify(
                patientRepository,
                never()
        ).save(any(Patient.class));
    }


    // =====================================================
    // TEST 5
    // GET PATIENT PROFILE
    // =====================================================

    @Test
    void shouldGetPatientProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                patientRepository.findByUser(user)
        ).thenReturn(
                Optional.of(patient)
        );


        PatientResponse response =
                patientService.getProfile(userId);


        assertNotNull(response);


        assertEquals(
                "Mannat",
                response.getName()
        );


        assertEquals(
                BloodGroup.A_POSITIVE,
                response.getBloodGroup()
        );


        assertEquals(
                "Blood disorder",
                response.getMedicalCondition()
        );


        verify(
                userRepository,
                times(1)
        ).findById(userId);


        verify(
                patientRepository,
                times(1)
        ).findByUser(user);
    }


    // =====================================================
    // TEST 6
    // PATIENT PROFILE NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenPatientProfileDoesNotExist() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                patientRepository.findByUser(user)
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                patientService.getProfile(
                                        userId
                                )
                );


        assertEquals(
                "Patient profile not found",
                exception.getMessage()
        );


        verify(
                patientRepository,
                times(1)
        ).findByUser(user);
    }


    // =====================================================
    // TEST 7
    // UPDATE PATIENT PROFILE
    // =====================================================

    @Test
    void shouldUpdatePatientProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                patientRepository.findByUser(user)
        ).thenReturn(
                Optional.of(patient)
        );


        when(
                patientRepository.save(any(Patient.class))
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        request.setBloodGroup(
                BloodGroup.B_POSITIVE
        );

        request.setMedicalCondition(
                "Updated condition"
        );


        PatientResponse response =
                patientService.updateProfile(
                        userId,
                        request
                );


        assertNotNull(response);


        assertEquals(
                BloodGroup.B_POSITIVE,
                response.getBloodGroup()
        );


        assertEquals(
                "Updated condition",
                response.getMedicalCondition()
        );


        assertFalse(
                patient.getEmergencyContactAvailable()
        );


        verify(
                patientRepository,
                times(1)
        ).save(patient);
    }


    // =====================================================
    // TEST 8
    // UPDATE WRONG ROLE
    // =====================================================

    @Test
    void shouldRejectUpdateForNonPatientUser() {

        user.setRole(Role.DONOR);


        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                patientService.updateProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Only patients can update patient profile",
                exception.getMessage()
        );


        verify(
                patientRepository,
                never()
        ).findByUser(any(User.class));


        verify(
                patientRepository,
                never()
        ).save(any(Patient.class));
    }


    // =====================================================
    // TEST 9
    // UPDATE PROFILE NOT FOUND
    // =====================================================

    @Test
    void shouldRejectUpdateWhenPatientProfileDoesNotExist() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                patientRepository.findByUser(user)
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                patientService.updateProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Patient profile not found",
                exception.getMessage()
        );


        verify(
                patientRepository,
                never()
        ).save(any(Patient.class));
    }
}