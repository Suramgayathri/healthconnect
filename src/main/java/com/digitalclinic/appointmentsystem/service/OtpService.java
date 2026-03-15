package com.digitalclinic.appointmentsystem.service;

import com.digitalclinic.appointmentsystem.model.OtpVerification;
import com.digitalclinic.appointmentsystem.repository.OtpVerificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
public class OtpService {
    
    @Autowired
    private OtpVerificationRepository otpRepository;
    
    @Autowired
    private EmailService emailService;
    
    private static final SecureRandom random = new SecureRandom();
    
    /**
     * Generate a 6-digit OTP code
     */
    private String generateOtpCode() {
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
    
    /**
     * Send OTP to user's email
     */
    @Transactional
    public void sendOtp(String email, String phone) {
        // Generate OTP
        String otpCode = generateOtpCode();
        
        // Save to database
        OtpVerification otpVerification = OtpVerification.builder()
                .email(email)
                .phone(phone)
                .otpCode(otpCode)
                .build();
        
        otpRepository.save(otpVerification);
        
        // Send email
        String subject = "HealthConnect - Your OTP Code";
        String body = String.format(
            "Hello,\n\n" +
            "Your OTP code for HealthConnect registration is: %s\n\n" +
            "This code will expire in 2 minutes.\n\n" +
            "If you didn't request this code, please ignore this email.\n\n" +
            "Best regards,\n" +
            "HealthConnect Team",
            otpCode
        );
        
        emailService.sendEmail(email, subject, body);
        
        log.info("OTP sent to email: {} | OTP Code: {}", email, otpCode);
    }
    
    /**
     * Verify OTP code
     */
    @Transactional
    public boolean verifyOtp(String email, String otpCode) {
        Optional<OtpVerification> otpOpt = otpRepository
                .findByEmailAndOtpCodeAndVerifiedFalse(email, otpCode);
        
        if (otpOpt.isEmpty()) {
            log.warn("Invalid OTP attempt for email: {}", email);
            return false;
        }
        
        OtpVerification otp = otpOpt.get();
        
        // Check if expired
        if (otp.isExpired()) {
            log.warn("Expired OTP for email: {}", email);
            return false;
        }
        
        // Check max attempts
        if (otp.isMaxAttemptsReached()) {
            log.warn("Max OTP attempts reached for email: {}", email);
            return false;
        }
        
        // Increment attempts
        otp.setAttempts(otp.getAttempts() + 1);
        
        // Mark as verified
        otp.setVerified(true);
        otpRepository.save(otp);
        
        log.info("OTP verified successfully for email: {}", email);
        return true;
    }
    
    /**
     * Clean up expired OTPs (can be scheduled)
     */
    @Transactional
    public void cleanupExpiredOtps() {
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        log.info("Cleaned up expired OTPs");
    }
}
