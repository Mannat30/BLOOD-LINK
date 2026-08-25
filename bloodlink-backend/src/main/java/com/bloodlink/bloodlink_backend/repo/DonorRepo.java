package com.bloodlink.bloodlink_backend.repo;

import com.bloodlink.bloodlink_backend.entity.Donor;
import com.bloodlink.bloodlink_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DonorRepo extends JpaRepository<Donor, UUID> {

    // =====================================================
    // EXISTING METHODS
    // =====================================================

    boolean existsByUser(User user);

    Optional<Donor> findByUser(User user);

    List<Donor> findByAvailableTrue();


    // =====================================================
    // POSTGIS - FIND NEARBY AVAILABLE DONORS
    // =====================================================

    @Query(value = """
            SELECT *
            FROM donors d
            WHERE d.available = true
            AND ST_DWithin(
                ST_SetSRID(
                    ST_MakePoint(
                        d.longitude,
                        d.latitude
                    ),
                    4326
                )::geography,
                ST_SetSRID(
                    ST_MakePoint(
                        :longitude,
                        :latitude
                    ),
                    4326
                )::geography,
                :radiusMeters
            )
            """,
            nativeQuery = true)
    List<Donor> findAvailableDonorsWithinRadius(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radiusMeters") double radiusMeters
    );
}