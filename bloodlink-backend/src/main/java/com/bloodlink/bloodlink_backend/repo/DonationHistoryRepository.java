package com.bloodlink.bloodlink_backend.repo;

import com.bloodlink.bloodlink_backend.entity.DonationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DonationHistoryRepository
        extends JpaRepository<DonationHistory, UUID> {
}