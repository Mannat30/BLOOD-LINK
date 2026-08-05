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
    public PatientResponse createProfile(UUID userId, PatientRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.PATIENT) {
            throw new RuntimeException("Only patients can create patient profile");
        }

        if (patientRepository.existsByUser(user)) {
            throw new RuntimeException("Patient profile already exists");
        }

        Patient patient = new Patient();

        patient.setUser(user);
        patient.setBloodGroup(request.getBloodGroup());
        patient.setGender(request.getGender());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setMedicalCondition(request.getMedicalCondition());
        patient.setEmergencyContactAvailable(request.getEmergencyContactAvailable());

        patientRepository.save(patient);

        return new PatientResponse(
                user.getName(),
                patient.getBloodGroup(),
                patient.getMedicalCondition()
        );
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
    public PatientResponse updateProfile(UUID userId, PatientRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        patient.setBloodGroup(request.getBloodGroup());
        patient.setGender(request.getGender());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setMedicalCondition(request.getMedicalCondition());
        patient.setEmergencyContactAvailable(request.getEmergencyContactAvailable());

        patientRepository.save(patient);

        return new PatientResponse(
                user.getName(),
                patient.getBloodGroup(),
                patient.getMedicalCondition()
        );
    }
}