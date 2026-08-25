package com.bloodlink.bloodlink_backend.repo;


import com.bloodlink.bloodlink_backend.entity.Hospital;
import com.bloodlink.bloodlink_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface HospitalRepository extends JpaRepository<Hospital, UUID> {

    Optional<Hospital> findByUser(User user);

    boolean existsByUser(User user);

    boolean existsByRegistrationNumber(String registrationNumber);
}
