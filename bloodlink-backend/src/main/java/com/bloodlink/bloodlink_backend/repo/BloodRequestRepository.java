package com.bloodlink.bloodlink_backend.repo;
import com.bloodlink.bloodlink_backend.Enum.RequestStatus;
import com.bloodlink.bloodlink_backend.entity.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BloodRequestRepository
        extends JpaRepository<BloodRequest, UUID> {

    List<BloodRequest> findByStatus(RequestStatus status);

}