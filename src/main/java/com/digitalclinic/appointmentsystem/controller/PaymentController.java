package com.digitalclinic.appointmentsystem.controller;

import com.digitalclinic.appointmentsystem.dto.PaymentRequestDTO;
import com.digitalclinic.appointmentsystem.dto.PaymentResponseDTO;
import com.digitalclinic.appointmentsystem.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Value;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> getPaymentConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("keyId", razorpayKeyId);
        return ResponseEntity.ok(config);
    }

    @PostMapping("/create-intent")
    public ResponseEntity<PaymentResponseDTO> createIntent(@RequestBody PaymentRequestDTO requestDTO) {
        // Return a mock intent
        return ResponseEntity.ok(paymentService.createIntent(requestDTO));
    }

    @PostMapping("/confirm")
    public ResponseEntity<PaymentResponseDTO> confirmPayment(
            @RequestBody PaymentRequestDTO requestDTO,
            @RequestParam Long patientId) {

        return ResponseEntity.ok(paymentService.processPayment(requestDTO, patientId));
    }
}
