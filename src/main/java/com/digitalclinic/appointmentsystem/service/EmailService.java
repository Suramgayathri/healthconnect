package com.digitalclinic.appointmentsystem.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@healthconnect.com}")
    private String fromEmail;
    
    /**
     * Send simple text email
     */
    public void sendEmail(String to, String subject, String body) {
        try {
            if (mailSender == null) {
                // Fallback: Log to console if email not configured
                log.warn("=".repeat(60));
                log.warn("EMAIL SERVICE NOT CONFIGURED - DEVELOPMENT MODE");
                log.warn("=".repeat(60));
                log.warn("To: {}", to);
                log.warn("Subject: {}", subject);
                log.warn("Body:\n{}", body);
                log.warn("=".repeat(60));
                
                // Also print to System.out for visibility
                System.out.println("\n" + "=".repeat(60));
                System.out.println("📧 OTP EMAIL (Development Mode)");
                System.out.println("=".repeat(60));
                System.out.println("To: " + to);
                System.out.println("Subject: " + subject);
                System.out.println("\n" + body);
                System.out.println("=".repeat(60) + "\n");
                return;
            }
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
            
        } catch (Exception e) {
            log.error("Failed to send email to: {}. Error: {}", to, e.getMessage());
            // Log OTP to console as fallback for development
            System.out.println("\n" + "=".repeat(60));
            System.out.println("📧 OTP EMAIL (Fallback - Email Failed)");
            System.out.println("=".repeat(60));
            System.out.println("To: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("\n" + body);
            System.out.println("=".repeat(60) + "\n");
        }
    }
}
