package com.bloodlink.bloodlink_backend.service;

import com.bloodlink.bloodlink_backend.Enum.Role;
import com.bloodlink.bloodlink_backend.dto.HospitalRequest;
import com.bloodlink.bloodlink_backend.dto.HospitalResponse;
import com.bloodlink.bloodlink_backend.entity.Hospital;
import com.bloodlink.bloodlink_backend.entity.User;
import com.bloodlink.bloodlink_backend.repo.HospitalRepository;
import com.bloodlink.bloodlink_backend.repo.Userrepo;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class HospitalServiceImp implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final Userrepo userRepository;

    public HospitalServiceImp(HospitalRepository hospitalRepository,
                               Userrepo userRepository) {
        this.hospitalRepository = hospitalRepository;
        this.userRepository = userRepository;
    }

    @Override
    public HospitalResponse createProfile(UUID userId,
                                          HospitalRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.HOSPITAL) {
            throw new RuntimeException("Only hospitals can create profile");
        }

        if (hospitalRepository.existsByUser(user)) {
            throw new RuntimeException("Hospital profile already exists");
        }

        if (hospitalRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new RuntimeException("Registration number already exists");
        }

        Hospital hospital = new Hospital();

        hospital.setUser(user);
        hospital.setHospitalName(request.getHospitalName());
        hospital.setRegistrationNumber(request.getRegistrationNumber());
        hospital.setContactPerson(request.getContactPerson());
        hospital.setContactPhone(request.getContactPhone());
        hospital.setCity(request.getCity());
        hospital.setState(request.getState());
        hospital.setPincode(request.getPincode());
        hospital.setLatitude(request.getLatitude());
        hospital.setLongitude(request.getLongitude());
        hospital.setVerified(false);

        hospitalRepository.save(hospital);

        return new HospitalResponse(
                hospital.getHospitalName(),
                hospital.getCity(),
                hospital.getVerified()
        );
    }

    @Override
    public HospitalResponse getProfile(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hospital hospital = hospitalRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        return new HospitalResponse(
                hospital.getHospitalName(),
                hospital.getCity(),
                hospital.getVerified()
        );
    }

    @Override
    public HospitalResponse updateProfile(UUID userId,
                                          HospitalRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hospital hospital = hospitalRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        hospital.setHospitalName(request.getHospitalName());
        hospital.setContactPerson(request.getContactPerson());
        hospital.setContactPhone(request.getContactPhone());
        hospital.setCity(request.getCity());
        hospital.setState(request.getState());
        hospital.setPincode(request.getPincode());
        hospital.setLatitude(request.getLatitude());
        hospital.setLongitude(request.getLongitude());

        hospitalRepository.save(hospital);

        return new HospitalResponse(
                hospital.getHospitalName(),
                hospital.getCity(),
                hospital.getVerified()
        );
    }
}