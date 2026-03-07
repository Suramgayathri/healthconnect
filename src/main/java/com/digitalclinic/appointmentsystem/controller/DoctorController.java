package com.digitalclinic.appointmentsystem.controller;

import com.digitalclinic.appointmentsystem.dto.DoctorProfileDTO;
import com.digitalclinic.appointmentsystem.dto.DoctorSearchDTO;
import com.digitalclinic.appointmentsystem.dto.DoctorScheduleDTO;
import com.digitalclinic.appointmentsystem.security.UserDetailsImpl;
import com.digitalclinic.appointmentsystem.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // PUBLIC ENDPOINTS

    @GetMapping("/search")
    public ResponseEntity<Page<DoctorProfileDTO>> searchDoctors(@ModelAttribute DoctorSearchDTO searchDTO) {
        return ResponseEntity.ok(doctorService.searchDoctors(searchDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorProfileDTO> getDoctorProfile(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorProfile(id));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<List<String>> getAvailableSlots(
            @PathVariable Long id,
            @RequestParam Long locationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(doctorService.getAvailableSlots(id, locationId, date));
    }

    @GetMapping("/specialization/{spec}")
    public ResponseEntity<List<DoctorProfileDTO>> getBySpecialization(@PathVariable String spec) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(spec));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<DoctorProfileDTO>> getTopRatedDoctors(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(doctorService.getTopRatedDoctors(limit));
    }

    // DOCTOR-ONLY ENDPOINTS

    @GetMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorProfileDTO> getMyProfile(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return ResponseEntity.ok(doctorService.getMyProfile(userDetails.getId()));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorProfileDTO> updateProfile(
            @RequestBody @Valid DoctorProfileDTO dto, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return ResponseEntity.ok(doctorService.updateDoctorProfile(userDetails.getId(), dto));
    }

    @GetMapping("/schedules")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<DoctorScheduleDTO>> getMySchedules(Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        DoctorProfileDTO doctorProfile = doctorService.getMyProfile(userDetails.getId());
        return ResponseEntity.ok(doctorService.getDoctorSchedules(doctorProfile.getDoctorId()));
    }

    @PostMapping("/schedule")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorScheduleDTO> createOrUpdateSchedule(
            @RequestBody @Valid DoctorScheduleDTO dto, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return ResponseEntity.ok(doctorService.createOrUpdateSchedule(userDetails.getId(), dto));
    }

    @DeleteMapping("/schedule/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> deleteSchedule(
            @PathVariable Long id, Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        doctorService.deleteSchedule(userDetails.getId(), id);
        return ResponseEntity.ok("Schedule deleted successfully");
    }

    @PostMapping("/locations")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<String> addClinicLocation(
            @RequestParam Long locationId,
            @RequestParam BigDecimal fee,
            @RequestParam boolean isPrimary,
            Authentication auth) {
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        doctorService.addClinicLocation(userDetails.getId(), locationId, fee, isPrimary);
        return ResponseEntity.ok("Clinic location added successfully");
    }
}
