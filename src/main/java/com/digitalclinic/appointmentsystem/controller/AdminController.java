package com.digitalclinic.appointmentsystem.controller;

import com.digitalclinic.appointmentsystem.dto.DoctorAdminDTO;
import com.digitalclinic.appointmentsystem.model.Doctor;
import com.digitalclinic.appointmentsystem.model.Patient;
import com.digitalclinic.appointmentsystem.model.User;
import com.digitalclinic.appointmentsystem.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminUserService.getAllUsers(page, size));
    }

    @GetMapping("/patients")
    public ResponseEntity<Page<Patient>> getPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminUserService.getAllPatients(page, size));
    }

    @GetMapping("/doctors")
    public ResponseEntity<Page<DoctorAdminDTO>> getDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminUserService.getAllDoctors(page, size));
    }

    @PatchMapping("/{userId}/toggle-status")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable Long userId) {
        adminUserService.toggleUserStatus(userId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/doctors/{doctorId}/approve")
    public ResponseEntity<?> approveDoctor(@PathVariable Long doctorId) {
        try {
            adminUserService.approveDoctor(doctorId);
            return ResponseEntity.ok().body(java.util.Map.of("message", "Doctor approved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/doctors/{doctorId}/reject")
    public ResponseEntity<?> rejectDoctor(@PathVariable Long doctorId) {
        try {
            adminUserService.rejectDoctor(doctorId);
            return ResponseEntity.ok().body(java.util.Map.of("message", "Doctor rejected successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
