package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.Role;
import com.bloodlink.bloodlink_backend.dto.HospitalRequest;
import com.bloodlink.bloodlink_backend.dto.HospitalResponse;
import com.bloodlink.bloodlink_backend.entity.Hospital;
import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.repo.HospitalRepository;
import com.bloodlink.bloodlink_backend.repo.Userrepo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class HospitalServiceImpTest {

    @Mock
    private HospitalRepository hospitalRepository;

    @Mock
    private Userrepo userRepository;

    @InjectMocks
    private HospitalServiceImp hospitalService;

    private UUID userId;

    private User user;

    private Hospital hospital;

    private HospitalRequest request;


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
        user.setName("City Hospital User");
        user.setEmail("hospital@example.com");
        user.setPhoneNumber("9876543210");
        user.setRole(Role.HOSPITAL);


        // =========================
        // HOSPITAL REQUEST
        // =========================

        request = new HospitalRequest();

        request.setHospitalName(
                "City Hospital"
        );

        request.setRegistrationNumber(
                "HOSP-001"
        );

        request.setContactPerson(
                "Rahul Sharma"
        );

        request.setContactPhone(
                "9876543210"
        );

        request.setCity(
                "Jaipur"
        );

        request.setState(
                "Rajasthan"
        );

        request.setPincode(
                "302001"
        );

        request.setLatitude(
                26.9124
        );

        request.setLongitude(
                75.7873
        );


        // =========================
        // HOSPITAL
        // =========================

        hospital = new Hospital();

        hospital.setUser(user);

        hospital.setHospitalName(
                "City Hospital"
        );

        hospital.setRegistrationNumber(
                "HOSP-001"
        );

        hospital.setContactPerson(
                "Rahul Sharma"
        );

        hospital.setContactPhone(
                "9876543210"
        );

        hospital.setCity(
                "Jaipur"
        );

        hospital.setState(
                "Rajasthan"
        );

        hospital.setPincode(
                "302001"
        );

        hospital.setLatitude(
                26.9124
        );

        hospital.setLongitude(
                75.7873
        );

        hospital.setVerified(false);
    }


    // =====================================================
    // TEST 1
    // CREATE HOSPITAL PROFILE
    // =====================================================

    @Test
    void shouldCreateHospitalProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                hospitalRepository.existsByUser(user)
        ).thenReturn(false);


        when(
                hospitalRepository.existsByRegistrationNumber(
                        request.getRegistrationNumber()
                )
        ).thenReturn(false);


        when(
                hospitalRepository.save(any(Hospital.class))
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        HospitalResponse response =
                hospitalService.createProfile(
                        userId,
                        request
                );


        assertNotNull(response);


        assertEquals(
                "City Hospital",
                response.getHospitalName()
        );


        assertEquals(
                "Jaipur",
                response.getCity()
        );


        assertFalse(
                response.getVerified()
        );


        verify(
                userRepository,
                times(1)
        ).findById(userId);


        verify(
                hospitalRepository,
                times(1)
        ).existsByUser(user);


        verify(
                hospitalRepository,
                times(1)
        ).existsByRegistrationNumber(
                request.getRegistrationNumber()
        );


        verify(
                hospitalRepository,
                times(1)
        ).save(any(Hospital.class));
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
                                hospitalService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "User not found",
                exception.getMessage()
        );


        verify(
                hospitalRepository,
                never()
        ).existsByUser(any(User.class));


        verify(
                hospitalRepository,
                never()
        ).save(any(Hospital.class));
    }


    // =====================================================
    // TEST 3
    // WRONG ROLE
    // =====================================================

    @Test
    void shouldRejectNonHospitalUser() {

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
                                hospitalService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Only hospitals can create profile",
                exception.getMessage()
        );


        verify(
                hospitalRepository,
                never()
        ).existsByUser(any(User.class));


        verify(
                hospitalRepository,
                never()
        ).save(any(Hospital.class));
    }


    // =====================================================
    // TEST 4
    // DUPLICATE HOSPITAL PROFILE
    // =====================================================

    @Test
    void shouldRejectDuplicateHospitalProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                hospitalRepository.existsByUser(user)
        ).thenReturn(true);


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                hospitalService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Hospital profile already exists",
                exception.getMessage()
        );


        verify(
                hospitalRepository,
                times(1)
        ).existsByUser(user);


        verify(
                hospitalRepository,
                never()
        ).existsByRegistrationNumber(anyString());


        verify(
                hospitalRepository,
                never()
        ).save(any(Hospital.class));
    }


    // =====================================================
    // TEST 5
    // DUPLICATE REGISTRATION NUMBER
    // =====================================================

    @Test
    void shouldRejectDuplicateRegistrationNumber() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                hospitalRepository.existsByUser(user)
        ).thenReturn(false);


        when(
                hospitalRepository.existsByRegistrationNumber(
                        request.getRegistrationNumber()
                )
        ).thenReturn(true);


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                hospitalService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Registration number already exists",
                exception.getMessage()
        );


        verify(
                hospitalRepository,
                times(1)
        ).existsByUser(user);


        verify(
                hospitalRepository,
                times(1)
        ).existsByRegistrationNumber(
                request.getRegistrationNumber()
        );


        verify(
                hospitalRepository,
                never()
        ).save(any(Hospital.class));
    }


    // =====================================================
    // TEST 6
    // GET HOSPITAL PROFILE
    // =====================================================

    @Test
    void shouldGetHospitalProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                hospitalRepository.findByUser(user)
        ).thenReturn(
                Optional.of(hospital)
        );


        HospitalResponse response =
                hospitalService.getProfile(userId);


        assertNotNull(response);


        assertEquals(
                "City Hospital",
                response.getHospitalName()
        );


        assertEquals(
                "Jaipur",
                response.getCity()
        );


        assertFalse(
                response.getVerified()
        );


        verify(
                userRepository,
                times(1)
        ).findById(userId);


        verify(
                hospitalRepository,
                times(1)
        ).findByUser(user);
    }


    // =====================================================
    // TEST 7
    // GET PROFILE - NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenHospitalProfileDoesNotExist() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                hospitalRepository.findByUser(user)
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                hospitalService.getProfile(
                                        userId
                                )
                );


        assertEquals(
                "Hospital not found",
                exception.getMessage()
        );


        verify(
                hospitalRepository,
                times(1)
        ).findByUser(user);
    }


    // =====================================================
    // TEST 8
    // UPDATE HOSPITAL PROFILE
    // =====================================================

    @Test
    void shouldUpdateHospitalProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                hospitalRepository.findByUser(user)
        ).thenReturn(
                Optional.of(hospital)
        );


        when(
                hospitalRepository.save(any(Hospital.class))
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        request.setHospitalName(
                "Updated City Hospital"
        );

        request.setContactPerson(
                "Amit Sharma"
        );

        request.setCity(
                "Delhi"
        );


        HospitalResponse response =
                hospitalService.updateProfile(
                        userId,
                        request
                );


        assertNotNull(response);


        assertEquals(
                "Updated City Hospital",
                response.getHospitalName()
        );


        assertEquals(
                "Delhi",
                response.getCity()
        );


        assertFalse(
                response.getVerified()
        );


        assertEquals(
                "Amit Sharma",
                hospital.getContactPerson()
        );


        verify(
                hospitalRepository,
                times(1)
        ).save(hospital);
    }


    // =====================================================
    // TEST 9
    // UPDATE PROFILE - NOT FOUND
    // =====================================================

    @Test
    void shouldRejectUpdateWhenHospitalDoesNotExist() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                hospitalRepository.findByUser(user)
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                hospitalService.updateProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Hospital not found",
                exception.getMessage()
        );


        verify(
                hospitalRepository,
                never()
        ).save(any(Hospital.class));
    }
}