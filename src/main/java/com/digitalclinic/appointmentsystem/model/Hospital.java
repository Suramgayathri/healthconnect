package com.digitalclinic.appointmentsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "hospitals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hospital_id")
    private Long id;

    @NotBlank(message = "Hospital name is required")
    @Size(max = 200)
    @Column(name = "hospital_name", nullable = false, length = 200)
    private String hospitalName;

    @NotBlank(message = "Address is required")
    @Column(name = "hospital_address", nullable = false, columnDefinition = "TEXT")
    private String hospitalAddress;

    @NotBlank(message = "City is required")
    @Size(max = 100)
    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Size(max = 100)
    @Column(name = "state", length = 100)
    private String state;

    @Size(max = 20)
    @Column(name = "pincode", length = 20)
    private String pincode;

    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;

    @Size(max = 100)
    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "website")
    private String website;

    @Column(name = "total_beds")
    private Integer totalBeds;

    @Column(name = "emergency_services")
    @Builder.Default
    private Boolean emergencyServices = false;

    @Column(name = "ambulance_services")
    @Builder.Default
    private Boolean ambulanceServices = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "facilities", columnDefinition = "TEXT")
    private String facilities;

    @Column(name = "image_url")
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
