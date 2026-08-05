package com.bloodlink.bloodlink_backend.service.impl;

import com.bloodlink.bloodlink_backend.dto.DonorResponse;
import com.bloodlink.bloodlink_backend.dto.DonorProfileRequest;
import com.bloodlink.bloodlink_backend.dto.DonorResponse;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.Enum.Role;
import com.bloodlink.bloodlink_backend.repo.DonorRepo;
import com.bloodlink.bloodlink_backend.repo.Userrepo;
import com.bloodlink.bloodlink_backend.repo.DonorRepo;
import com.bloodlink.bloodlink_backend.repo.Userrepo;
import com.bloodlink.bloodlink_backend.service.DonorService;
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


    @Override
    public DonorResponse createProfile(UUID userId,
                                       DonorProfileRequest request) {

        // User Validation
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Role Validation
        if (user.getRole() != Role.DONOR) {
            throw new RuntimeException("Only donor can create donor profile");
        }

        // Duplicate Profile Check
        if (donorRepository.existsByUser(user)) {
            throw new RuntimeException("Donor profile already exists");
        }

        // Age Validation
        int age = Period.between(request.getDateOfBirth(), LocalDate.now()).getYears();

        if (age < 18) {
            throw new RuntimeException("Age must be at least 18 years");
        }

        // Weight Validation
        if (request.getWeight() < 50) {
            throw new RuntimeException("Weight must be at least 50 kg");
        }

        // Create Donor
        Donor donor = new Donor();

        donor.setUser(user);
        donor.setBloodGroup(request.getBloodGroup());
        donor.setGender(request.getGender());
        donor.setDateOfBirth(request.getDateOfBirth());
        donor.setWeight(request.getWeight());
        donor.setLastDonationDate(request.getLastDonationDate());
        donor.setAvailable(request.getAvailable());
        donor.setCity(request.getCity());
        donor.setState(request.getState());
        donor.setPincode(request.getPincode());
        donor.setLatitude(request.getLatitude());
        donor.setLongitude(request.getLongitude());

        donorRepository.save(donor);

        return new DonorResponse(
                user.getName(),
                donor.getBloodGroup(),
                donor.getCity(),
                donor.getAvailable()
        );
    }

    @Override
    public DonorResponse getProfile(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Donor profile not found"));

        return new DonorResponse(
                user.getName(),
                donor.getBloodGroup(),
                donor.getCity(),
                donor.getAvailable()
        );
    }

    @Override
    public DonorResponse updateProfile(UUID userId,
                                              DonorProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Donor donor = donorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Donor profile not found"));

        donor.setBloodGroup(request.getBloodGroup());
        donor.setGender(request.getGender());
        donor.setDateOfBirth(request.getDateOfBirth());
        donor.setWeight(request.getWeight());
        donor.setLastDonationDate(request.getLastDonationDate());
        donor.setAvailable(request.getAvailable());
        donor.setCity(request.getCity());
        donor.setState(request.getState());
        donor.setPincode(request.getPincode());
        donor.setLatitude(request.getLatitude());
        donor.setLongitude(request.getLongitude());

        donorRepository.save(donor);

        return new DonorResponse(
                user.getName(),
                donor.getBloodGroup(),
                donor.getCity(),
                donor.getAvailable()
        );
    }
}