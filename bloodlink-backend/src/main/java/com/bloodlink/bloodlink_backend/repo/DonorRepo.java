package com.bloodlink.bloodlink_backend.repo;

import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DonorRepo extends JpaRepository<Donor, UUID> {

    Optional<Donor> findByUser(User user);

    boolean existsByUser(User user);
    List<Donor> findByAvailableTrue();

    List<Donor> findByBloodGroup(BloodGroup bloodGroup);
}