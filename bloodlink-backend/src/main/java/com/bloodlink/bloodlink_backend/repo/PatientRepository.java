package com.bloodlink.bloodlink_backend.repo;

import com.bloodlink.bloodlink_backend.entity.Patient;
import com.bloodlink.bloodlink_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {

    Optional<Patient> findByUser(User user);

    boolean existsByUser(User user);

}