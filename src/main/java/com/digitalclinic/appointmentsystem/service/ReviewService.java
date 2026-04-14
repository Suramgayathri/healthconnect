package com.digitalclinic.appointmentsystem.service;

import com.digitalclinic.appointmentsystem.model.Appointment;
import com.digitalclinic.appointmentsystem.model.Doctor;
import com.digitalclinic.appointmentsystem.model.Patient;
import com.digitalclinic.appointmentsystem.model.Review;
import com.digitalclinic.appointmentsystem.repository.AppointmentRepository;
import com.digitalclinic.appointmentsystem.repository.DoctorRepository;
import com.digitalclinic.appointmentsystem.repository.PatientRepository;
import com.digitalclinic.appointmentsystem.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Transactional
    public Review addReview(Long patientId, Long appointmentId, Integer rating, String reviewText) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
                
        if (!appointment.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("Patient is not authorized to review this appointment");
        }

        if (reviewRepository.findByAppointmentId(appointmentId).isPresent()) {
            throw new RuntimeException("Review already exists for this appointment");
        }
        
        Doctor doctor = appointment.getDoctor();
        Patient patient = appointment.getPatient();

        Review review = Review.builder()
                .patient(patient)
                .doctor(doctor)
                .appointment(appointment)
                .rating(rating)
                .reviewText(reviewText)
                .isVerified(true)
                .build();
                
        Review savedReview = reviewRepository.save(review);
        updateDoctorRating(doctor);
        return savedReview;
    }

    private void updateDoctorRating(Doctor doctor) {
        List<Review> doctorReviews = reviewRepository.findByDoctorId(doctor.getId());
        if (doctorReviews.isEmpty()) return;
        
        double sum = doctorReviews.stream().mapToInt(Review::getRating).sum();
        double avg = sum / doctorReviews.size();
        
        doctor.setTotalReviews(doctorReviews.size());
        doctor.setAverageRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
        doctorRepository.save(doctor);
    }

    public List<Review> getDoctorReviews(Long doctorId) {
        return reviewRepository.findByDoctorId(doctorId);
    }
}
