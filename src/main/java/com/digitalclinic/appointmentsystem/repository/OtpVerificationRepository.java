package com.digitalclinic.appointmentsystem.repository;

import com.digitalclinic.appointmentsystem.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    
    Optional<OtpVerification> findTopByEmailOrPhoneOrderByCreatedAtDesc(String email, String phone);
    
    Optional<OtpVerification> findByEmailAndOtpCodeAndVerifiedFalse(String email, String otpCode);
    
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
