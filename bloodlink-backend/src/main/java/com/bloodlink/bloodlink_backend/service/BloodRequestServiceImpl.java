package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.dto.BloodRequestDto;
import com.bloodlink.bloodlink_backend.dto.BloodResponse;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import com.bloodlink.bloodlink_backend.entity.Hospital;
import com.bloodlink.bloodlink_backend.entity.Patient;
import com.bloodlink.bloodlink_backend.Enum.RequestStatus;
import com.bloodlink.bloodlink_backend.repo.BloodRequestRepository;
import com.bloodlink.bloodlink_backend.repo.HospitalRepository;
import com.bloodlink.bloodlink_backend.repo.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BloodRequestServiceImpl implements BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;

    public BloodRequestServiceImpl(BloodRequestRepository bloodRequestRepository,
                                   PatientRepository patientRepository,
                                   HospitalRepository hospitalRepository) {

        this.bloodRequestRepository = bloodRequestRepository;
        this.patientRepository = patientRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @Override
    public BloodResponse createRequest(BloodRequestDto request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        if (request.getUnitsRequired() <= 0) {
            throw new RuntimeException("Units must be greater than 0");
        }

        if (request.getUnitsRequired() > 10) {
            throw new RuntimeException("Maximum 10 units allowed");
        }

        if (request.getRequiredBefore().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Required time must be in future");
        }

        com.bloodlink.bloodlink_backend.entity.BloodRequest bloodRequest =
                new com.bloodlink.bloodlink_backend.entity.BloodRequest();

        bloodRequest.setPatient(patient);
        bloodRequest.setHospital(hospital);
        bloodRequest.setBloodGroup(request.getBloodGroup());
        bloodRequest.setUnitsRequired(request.getUnitsRequired());
        bloodRequest.setPriority(request.getPriority());
        bloodRequest.setEmergencyType(request.getEmergencyType());
        bloodRequest.setReason(request.getReason());
        bloodRequest.setRequiredBefore(request.getRequiredBefore());

        bloodRequest.setStatus(RequestStatus.PENDING);
        bloodRequest.setFulfilledUnits(0);
        bloodRequest.setRemainingUnits(request.getUnitsRequired());

        bloodRequestRepository.save(bloodRequest);

        return new BloodResponse(
                bloodRequest.getId(),
                bloodRequest.getStatus(),
                "Blood Request Created Successfully"
        );
    }

    @Override
    public BloodResponse getRequest(UUID requestId) {

        com.bloodlink.bloodlink_backend.entity.BloodRequest bloodRequest =
                bloodRequestRepository.findById(requestId)
                        .orElseThrow(() -> new RuntimeException("Blood Request Not Found"));

        return new BloodResponse(
                bloodRequest.getId(),
                bloodRequest.getStatus(),
                "Blood Request Found"
        );
    }

    @Override
    public List<BloodResponse> getPendingRequests() {

        List<com.bloodlink.bloodlink_backend.entity.BloodRequest> requests =
                bloodRequestRepository.findByStatus(RequestStatus.PENDING);

        return requests.stream()
                .map(request -> new BloodResponse(
                        request.getId(),
                        request.getStatus(),
                        "Pending Request"
                ))
                .toList();
    }

    @Override
    public BloodResponse cancelRequest(UUID requestId) {

        com.bloodlink.bloodlink_backend.entity.BloodRequest bloodRequest =
                bloodRequestRepository.findById(requestId)
                        .orElseThrow(() -> new RuntimeException("Blood Request Not Found"));

        bloodRequest.setStatus(RequestStatus.CANCELLED);

        bloodRequestRepository.save(bloodRequest);

        return new BloodResponse(
                bloodRequest.getId(),
                bloodRequest.getStatus(),
                "Blood Request Cancelled Successfully"
        );
    }
}
