package com.digitalclinic.appointmentsystem.controller;

import com.digitalclinic.appointmentsystem.model.Review;
import com.digitalclinic.appointmentsystem.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> addReview(
            @RequestParam Long patientId,
            @PathVariable Long appointmentId,
            @RequestParam Integer rating,
            @RequestParam(required = false) String reviewText) {
        try {
            Review review = reviewService.addReview(patientId, appointmentId, rating, reviewText);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Review>> getDoctorReviews(@PathVariable Long doctorId) {
        return ResponseEntity.ok(reviewService.getDoctorReviews(doctorId));
    }
}
