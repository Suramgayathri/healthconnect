package com.digitalclinic.appointmentsystem.service;

import com.digitalclinic.appointmentsystem.dto.PatientProfileDTO;
import com.digitalclinic.appointmentsystem.model.Patient;
import com.digitalclinic.appointmentsystem.repository.PatientRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class PatientService {

    private static final Logger logger = LoggerFactory.getLogger(PatientService.class);

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private ModelMapper modelMapper;

    public PatientProfileDTO getPatientProfile(Long userId) {
        logger.info("Fetching patient profile for user ID: {}", userId);
        Patient patient = patientRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found for user ID: " + userId));
        return convertToDTO(patient);
    }

    public PatientProfileDTO updatePatientProfile(Long userId, PatientProfileDTO dto) {
        logger.info("Updating patient profile for user ID: {}", userId);
        Patient patient = patientRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        patient.setFullName(dto.getFullName());
        patient.setDob(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setAddress(dto.getAddress());
        patient.setCity(dto.getCity());
        patient.setState(dto.getState());
        patient.setPincode(dto.getPincode());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setEmergencyContactName(dto.getEmergencyContactName());

        Patient updatedPatient = patientRepository.save(patient);
        return convertToDTO(updatedPatient);
    }

    public PatientProfileDTO getMedicalHistory(Long userId) {
        logger.info("Fetching medical history for user ID: {}", userId);
        Patient patient = patientRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        return convertToDTO(patient);
    }

    public void updateMedicalHistory(Long userId, String allergies, String chronicConditions, String medicalHistory) {
        logger.info("Updating medical history for user ID: {}", userId);
        Patient patient = patientRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        patient.setAllergies(allergies);
        patient.setChronicConditions(chronicConditions);
        patient.setMedicalHistory(medicalHistory);

        patientRepository.save(patient);
    }

    public Map<String, Object> getPatientStats(Long userId) {
        logger.info("Fetching stats for user ID: {}", userId);
        // Assuming no appointments available yet, returning mock stats
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAppointments", 0);
        stats.put("upcomingCount", 0);
        stats.put("completedCount", 0);
        stats.put("cancelledCount", 0);
        return stats;
    }

    public List<PatientProfileDTO> searchPatients(String searchTerm) {
        logger.info("Searching patients with term: {}", searchTerm);
        List<Patient> patients = patientRepository.findByFullNameContainingIgnoreCase(searchTerm);
        return patients.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PatientProfileDTO convertToDTO(Patient patient) {
        PatientProfileDTO dto = modelMapper.map(patient, PatientProfileDTO.class);
        dto.setPatientId(patient.getId());
        if (patient.getUser() != null) {
            dto.setEmail(patient.getUser().getEmail());
        }
        return dto;
    }
}
