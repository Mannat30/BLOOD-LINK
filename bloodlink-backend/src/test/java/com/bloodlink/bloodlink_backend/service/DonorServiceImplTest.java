package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.Gender;
import com.bloodlink.bloodlink_backend.Enum.Role;
import com.bloodlink.bloodlink_backend.dto.DonorProfileRequest;
import com.bloodlink.bloodlink_backend.dto.DonorResponse;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.repo.DonorRepo;
import com.bloodlink.bloodlink_backend.repo.Userrepo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
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
class DonorServiceImplTest {

    @Mock
    private DonorRepo donorRepository;

    @Mock
    private Userrepo userRepository;

    @InjectMocks
    private DonorServiceImpl donorService;

    private UUID userId;

    private User user;

    private Donor donor;

    private DonorProfileRequest request;


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
        user.setRole(Role.DONOR);


        // =========================
        // DONOR REQUEST
        // =========================

        request = new DonorProfileRequest();

        request.setBloodGroup(
                BloodGroup.A_POSITIVE
        );

        request.setGender(
                Gender.MALE
        );

        request.setDateOfBirth(
                LocalDate.of(2000, 1, 1)
        );

        request.setWeight(65.0);

        request.setCity("Jaipur");

        request.setState("Rajasthan");

        request.setPincode("302001");

        request.setLatitude(26.9124);

        request.setLongitude(75.7873);


        // =========================
        // DONOR
        // =========================

        donor = new Donor();

        donor.setUser(user);

        donor.setBloodGroup(
                BloodGroup.A_POSITIVE
        );

        donor.setGender(
                Gender.MALE
        );

        donor.setDateOfBirth(
                LocalDate.of(2000, 1, 1)
        );

        donor.setWeight(65.0);

        donor.setCity("Jaipur");

        donor.setState("Rajasthan");

        donor.setPincode("302001");

        donor.setLatitude(26.9124);

        donor.setLongitude(75.7873);

        donor.setAvailable(true);
    }


    // =====================================================
    // TEST 1
    // CREATE DONOR PROFILE
    // =====================================================

    @Test
    void shouldCreateDonorProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                donorRepository.existsByUser(user)
        ).thenReturn(false);


        when(
                donorRepository.save(any(Donor.class))
        ).thenAnswer(invocation -> {

            Donor savedDonor =
                    invocation.getArgument(0);

            return savedDonor;
        });


        DonorResponse response =
                donorService.createProfile(
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
                "Jaipur",
                response.getCity()
        );


        assertTrue(
                response.getAvailable()
        );


        verify(
                userRepository,
                times(1)
        ).findById(userId);


        verify(
                donorRepository,
                times(1)
        ).existsByUser(user);


        verify(
                donorRepository,
                times(1)
        ).save(any(Donor.class));
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
                                donorService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "User not found",
                exception.getMessage()
        );


        verify(
                userRepository,
                times(1)
        ).findById(userId);


        verify(
                donorRepository,
                never()
        ).existsByUser(any(User.class));


        verify(
                donorRepository,
                never()
        ).save(any(Donor.class));
    }


    // =====================================================
    // TEST 3
    // ONLY DONOR CAN CREATE PROFILE
    // =====================================================

    @Test
    void shouldRejectNonDonorUser() {

        user.setRole(Role.PATIENT);


        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donorService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Only donor can create donor profile",
                exception.getMessage()
        );


        verify(
                userRepository,
                times(1)
        ).findById(userId);


        verify(
                donorRepository,
                never()
        ).existsByUser(any(User.class));


        verify(
                donorRepository,
                never()
        ).save(any(Donor.class));
    }


    // =====================================================
    // TEST 4
    // DUPLICATE DONOR PROFILE
    // =====================================================

    @Test
    void shouldRejectDuplicateDonorProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                donorRepository.existsByUser(user)
        ).thenReturn(true);


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donorService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Donor profile already exists",
                exception.getMessage()
        );


        verify(
                donorRepository,
                times(1)
        ).existsByUser(user);


        verify(
                donorRepository,
                never()
        ).save(any(Donor.class));
    }


    // =====================================================
    // TEST 5
    // AGE VALIDATION
    // =====================================================

    @Test
    void shouldRejectDonorBelow18() {

        request.setDateOfBirth(
                LocalDate.now().minusYears(17)
        );


        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                donorRepository.existsByUser(user)
        ).thenReturn(false);


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donorService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Age must be at least 18 years",
                exception.getMessage()
        );


        verify(
                donorRepository,
                never()
        ).save(any(Donor.class));
    }


    // =====================================================
    // TEST 6
    // WEIGHT VALIDATION
    // =====================================================

    @Test
    void shouldRejectDonorBelowMinimumWeight() {

        request.setWeight(45.0);


        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                donorRepository.existsByUser(user)
        ).thenReturn(false);


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donorService.createProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Weight must be at least 50 kg",
                exception.getMessage()
        );


        verify(
                donorRepository,
                never()
        ).save(any(Donor.class));
    }


    // =====================================================
    // TEST 7
    // GET DONOR PROFILE
    // =====================================================

    @Test
    void shouldGetDonorProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                donorRepository.findByUser(user)
        ).thenReturn(
                Optional.of(donor)
        );


        DonorResponse response =
                donorService.getProfile(userId);


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
                "Jaipur",
                response.getCity()
        );


        assertTrue(
                response.getAvailable()
        );


        verify(
                userRepository,
                times(1)
        ).findById(userId);


        verify(
                donorRepository,
                times(1)
        ).findByUser(user);
    }


    // =====================================================
    // TEST 8
    // GET PROFILE - NOT FOUND
    // =====================================================

    @Test
    void shouldRejectWhenDonorProfileDoesNotExist() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                donorRepository.findByUser(user)
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donorService.getProfile(userId)
                );


        assertEquals(
                "Donor profile not found",
                exception.getMessage()
        );


        verify(
                donorRepository,
                times(1)
        ).findByUser(user);
    }


    // =====================================================
    // TEST 9
    // UPDATE DONOR PROFILE
    // =====================================================

    @Test
    void shouldUpdateDonorProfile() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                donorRepository.findByUser(user)
        ).thenReturn(
                Optional.of(donor)
        );


        when(
                donorRepository.save(any(Donor.class))
        ).thenAnswer(invocation ->
                invocation.getArgument(0)
        );


        request.setBloodGroup(
                BloodGroup.B_POSITIVE
        );

        request.setWeight(70.0);

        request.setCity("Delhi");


        DonorResponse response =
                donorService.updateProfile(
                        userId,
                        request
                );


        assertNotNull(response);


        assertEquals(
                BloodGroup.B_POSITIVE,
                response.getBloodGroup()
        );


        assertEquals(
                "Delhi",
                response.getCity()
        );


        assertTrue(
                response.getAvailable()
        );


        assertEquals(
                70.0,
                donor.getWeight()
        );


        verify(
                donorRepository,
                times(1)
        ).save(donor);
    }


    // =====================================================
    // TEST 10
    // UPDATE PROFILE NOT FOUND
    // =====================================================

    @Test
    void shouldRejectUpdateWhenProfileDoesNotExist() {

        when(
                userRepository.findById(userId)
        ).thenReturn(
                Optional.of(user)
        );


        when(
                donorRepository.findByUser(user)
        ).thenReturn(
                Optional.empty()
        );


        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () ->
                                donorService.updateProfile(
                                        userId,
                                        request
                                )
                );


        assertEquals(
                "Donor profile not found",
                exception.getMessage()
        );


        verify(
                donorRepository,
                never()
        ).save(any(Donor.class));
    }
}