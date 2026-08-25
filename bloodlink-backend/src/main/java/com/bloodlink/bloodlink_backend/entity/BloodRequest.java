package com.bloodlink.bloodlink_backend.entity;
import com.bloodlink.bloodlink_backend.Enum.BloodGroup;
import com.bloodlink.bloodlink_backend.Enum.EmergencyType;
import com.bloodlink.bloodlink_backend.Enum.RequestPriority;
import com.bloodlink.bloodlink_backend.Enum.RequestStatus;
import com.bloodlink.bloodlink_backend.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "blood_requests")
@Getter
@Setter
public class BloodRequest {

    @Id
    @UuidGenerator
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BloodGroup bloodGroup;

    @Column(nullable = false)
    private Integer unitsRequired;

    @Enumerated(EnumType.STRING)
    private RequestPriority priority;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @Enumerated(EnumType.STRING)
    private EmergencyType emergencyType;

    @Column(nullable = false)
    private String reason;

    @Column(nullable =false)
    private LocalDateTime requiredBefore;

    private Integer fulfilledUnits;

    private Integer remainingUnits;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}