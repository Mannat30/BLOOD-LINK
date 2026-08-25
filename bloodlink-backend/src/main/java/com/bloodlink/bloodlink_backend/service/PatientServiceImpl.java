package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.Role;
import com.bloodlink.bloodlink_backend.dto.PatientRequest;
import com.bloodlink.bloodlink_backend.dto.PatientResponse;
import com.bloodlink.bloodlink_backend.entity.Patient;
import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.repo.PatientRepository;
import com.bloodlink.bloodlink_backend.repo.Userrepo;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final Userrepo userRepository;

    public PatientServiceImpl(PatientRepository patientRepository,
                              Userrepo userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }


    @Override
    public PatientResponse getProfile(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        return new PatientResponse(
                user.getName(),
                patient.getBloodGroup(),
                patient.getMedicalCondition()
        );
    }
    @Override
    public PatientResponse createProfile(
            UUID userId,
            PatientRequest request) {

        // 1. Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // 2. Check role
        if (user.getRole() != Role.PATIENT) {
            throw new RuntimeException(
                    "Only patients can create patient profile"
            );
        }

        // 3. Check duplicate profile
        if (patientRepository.existsByUser(user)) {
            throw new RuntimeException(
                    "Patient profile already exists"
            );
        }

        // 4. Create patient
        Patient patient = new Patient();

        patient.setUser(user);

        patient.setBloodGroup(
                request.getBloodGroup()
        );

        patient.setGender(
                request.getGender()
        );

        patient.setDateOfBirth(
                request.getDateOfBirth()
        );

        patient.setMedicalCondition(
                request.getMedicalCondition()
        );

        // 5. Default value
        patient.setEmergencyContactAvailable(false);

        // 6. Save patient
        patientRepository.save(patient);

        // 7. Return response
        return new PatientResponse(
                user.getName(),
                patient.getBloodGroup(),
                patient.getMedicalCondition()
        );
    }
    @Override
    public PatientResponse updateProfile(
            UUID userId,
            PatientRequest request) {

        // 1. Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // 2. Check role
        if (user.getRole() != Role.PATIENT) {
            throw new RuntimeException(
                    "Only patients can update patient profile"
            );
        }

        // 3. Find patient profile
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Patient profile not found")
                );

        // 4. Update profile fields
        patient.setBloodGroup(
                request.getBloodGroup()
        );

        patient.setGender(
                request.getGender()
        );

        patient.setDateOfBirth(
                request.getDateOfBirth()
        );

        patient.setMedicalCondition(
                request.getMedicalCondition()
        );

        // 5. Keep emergency contact value non-null
        patient.setEmergencyContactAvailable(false);

        // 6. Save
        patientRepository.save(patient);

        // 7. Return response
        return new PatientResponse(
                user.getName(),
                patient.getBloodGroup(),
                patient.getMedicalCondition()
        );
    }
}