package com.bloodlink.bloodlink_backend.repo;

import com.bloodlink.bloodlink_backend.entity.DonorMatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DonorMatchRepository extends JpaRepository<DonorMatch, UUID> {

    List<DonorMatch> findByBloodRequestIdOrderByRankAsc(UUID bloodRequestId);

}