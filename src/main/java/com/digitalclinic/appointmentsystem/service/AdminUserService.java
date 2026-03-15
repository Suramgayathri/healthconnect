package com.digitalclinic.appointmentsystem.service;

import com.digitalclinic.appointmentsystem.dto.DoctorAdminDTO;
import com.digitalclinic.appointmentsystem.model.Doctor;
import com.digitalclinic.appointmentsystem.model.Patient;
import com.digitalclinic.appointmentsystem.model.User;
import com.digitalclinic.appointmentsystem.repository.DoctorRepository;
import com.digitalclinic.appointmentsystem.repository.PatientRepository;
import com.digitalclinic.appointmentsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor 
public class AdminUserService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public Page<User> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size));
    }

    public Page<Patient> getAllPatients(int page, int size) {
        return patientRepository.findAll(PageRequest.of(page, size));
    }

    public Page<DoctorAdminDTO> getAllDoctors(int page, int size) {
        Page<Doctor> doctors = doctorRepository.findAll(PageRequest.of(page, size));
        return doctors.map(this::convertToDTO);
    }

    private DoctorAdminDTO convertToDTO(Doctor doctor) {
        DoctorAdminDTO.UserBasicDTO userDTO = null;
        if (doctor.getUser() != null) {
            userDTO = DoctorAdminDTO.UserBasicDTO.builder()
                    .id(doctor.getUser().getId())
                    .email(doctor.getUser().getEmail())
                    .phone(doctor.getUser().getPhone())
                    .active(doctor.getUser().isActive())
                    .createdAt(doctor.getUser().getCreatedAt())
                    .build();
        }

        return DoctorAdminDTO.builder()
                .id(doctor.getId())
                .fullName(doctor.getFullName())
                .specialty(doctor.getSpecialty())
                .specialization(doctor.getSpecialization())
                .qualifications(doctor.getQualifications())
                .licenseNumber(doctor.getLicenseNumber())
                .experienceYears(doctor.getExperienceYears())
                .about(doctor.getAbout())
                .profilePhoto(doctor.getProfilePhoto())
                .languagesSpoken(doctor.getLanguagesSpoken())
                .consultationFee(doctor.getConsultationFee())
                .averageRating(doctor.getAverageRating())
                .totalReviews(doctor.getTotalReviews())
                .isAvailable(doctor.getAvailable() != null ? doctor.getAvailable() : false)
                .isVerified(doctor.getVerified() != null ? doctor.getVerified() : false)
                .createdAt(doctor.getCreatedAt())
                .updatedAt(doctor.getUpdatedAt())
                .user(userDTO)
                .build();
    }

    @Transactional
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    @Transactional
    public void approveDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setIsVerified(true);
        doctor.setIsAvailable(true);
        doctorRepository.save(doctor);
    }

    @Transactional
    public void rejectDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setIsVerified(false);
        doctor.setIsAvailable(false);
        doctorRepository.save(doctor);
    }
}
