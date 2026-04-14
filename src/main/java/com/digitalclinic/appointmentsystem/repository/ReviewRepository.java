package com.digitalclinic.appointmentsystem.repository;

import com.digitalclinic.appointmentsystem.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByDoctorId(Long doctorId);
    
    List<Review> findByPatientId(Long patientId);
    
    Optional<Review> findByAppointmentId(Long appointmentId);
}
