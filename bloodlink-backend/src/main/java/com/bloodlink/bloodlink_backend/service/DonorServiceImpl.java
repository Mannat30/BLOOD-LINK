package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.Role;
import com.bloodlink.bloodlink_backend.dto.DonorProfileRequest;
import com.bloodlink.bloodlink_backend.dto.DonorResponse;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.repo.DonorRepo;
import com.bloodlink.bloodlink_backend.repo.Userrepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DonorServiceImpl implements DonorService {

    private final DonorRepo donorRepository;
    private final Userrepo userRepository;


    // =====================================================
    // CREATE DONOR PROFILE
    // =====================================================

    @Override
    public DonorResponse createProfile(
            UUID userId,
            DonorProfileRequest request) {

        // 1. Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // 2. Check role
        if (user.getRole() != Role.DONOR) {

            throw new RuntimeException(
                    "Only donor can create donor profile"
            );
        }


        // 3. Check existing profile
        if (donorRepository.existsByUser(user)) {

            throw new RuntimeException(
                    "Donor profile already exists"
            );
        }


        // 4. Age validation
        int age = Period.between(
                request.getDateOfBirth(),
                LocalDate.now()
        ).getYears();

        if (age < 18) {

            throw new RuntimeException(
                    "Age must be at least 18 years"
            );
        }


        // 5. Weight validation
        if (request.getWeight() < 50) {

            throw new RuntimeException(
                    "Weight must be at least 50 kg"
            );
        }


        // =================================================
        // CREATE DONOR
        // =================================================

        Donor donor = new Donor();

        donor.setUser(user);

        donor.setBloodGroup(
                request.getBloodGroup()
        );

        donor.setGender(
                request.getGender()
        );

        donor.setDateOfBirth(
                request.getDateOfBirth()
        );

        donor.setWeight(
                request.getWeight()
        );

        donor.setCity(
                request.getCity()
        );

        donor.setState(
                request.getState()
        );

        donor.setPincode(
                request.getPincode()
        );

        donor.setLatitude(
                request.getLatitude()
        );

        donor.setLongitude(
                request.getLongitude()
        );


        // =================================================
        // DEFAULT VALUES
        // =================================================

        donor.setAvailable(true);

        donor.setSuccessfulDonations(0);

        donor.setTotalRequestsAccepted(0);

        donor.setTotalRequestsRejected(0);

        donor.setBloodLinkScore(0.0);


        // =================================================
        // SAVE
        // =================================================

        donorRepository.save(donor);


        // =================================================
        // RETURN COMPLETE RESPONSE
        // =================================================

        return buildDonorResponse(user, donor);
    }


    // =====================================================
    // GET DONOR PROFILE
    // =====================================================

    @Override
    public DonorResponse getProfile(UUID userId) {

        // 1. Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // 2. Find donor profile
        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Donor profile not found"
                        )
                );


        // 3. Return complete profile
        return buildDonorResponse(user, donor);
    }


    // =====================================================
    // UPDATE DONOR PROFILE
    // =====================================================

    @Override
    public DonorResponse updateProfile(
            UUID userId,
            DonorProfileRequest request) {

        // 1. Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // 2. Find donor
        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Donor profile not found"
                        )
                );


        // =================================================
        // UPDATE DONOR INFORMATION
        // =================================================

        donor.setBloodGroup(
                request.getBloodGroup()
        );

        donor.setGender(
                request.getGender()
        );

        donor.setDateOfBirth(
                request.getDateOfBirth()
        );

        donor.setWeight(
                request.getWeight()
        );

        donor.setCity(
                request.getCity()
        );

        donor.setState(
                request.getState()
        );

        donor.setPincode(
                request.getPincode()
        );

        donor.setLatitude(
                request.getLatitude()
        );

        donor.setLongitude(
                request.getLongitude()
        );


        // =================================================
        // SAVE
        // =================================================

        donorRepository.save(donor);


        // =================================================
        // RETURN COMPLETE RESPONSE
        // =================================================

        return buildDonorResponse(user, donor);
    }


    // =====================================================
    // BUILD DONOR RESPONSE
    // =====================================================

    private DonorResponse buildDonorResponse(
            User user,
            Donor donor) {

        return new DonorResponse(

                // =========================
                // DONOR ID
                // =========================

                donor.getId(),


                // =========================
                // USER INFORMATION
                // =========================

                user.getName(),

                user.getEmail(),

                user.getPhoneNumber(),

                user.getRole() != null
                        ? user.getRole().name()
                        : null,


                // =========================
                // DONOR INFORMATION
                // =========================

                donor.getBloodGroup(),

                donor.getGender(),

                donor.getDateOfBirth(),

                donor.getWeight(),


                // =========================
                // LOCATION
                // =========================

                donor.getCity(),

                donor.getState(),

                donor.getPincode(),

                donor.getLatitude(),

                donor.getLongitude(),


                // =========================
                // AVAILABILITY
                // =========================

                donor.getAvailable(),


                // =========================
                // STATISTICS
                // =========================

                donor.getSuccessfulDonations(),

                donor.getTotalRequestsAccepted(),

                donor.getTotalRequestsRejected()
        );
    }
}