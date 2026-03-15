package com.digitalclinic.appointmentsystem.service;

import com.digitalclinic.appointmentsystem.dto.HospitalDTO;
import com.digitalclinic.appointmentsystem.model.Hospital;
import com.digitalclinic.appointmentsystem.repository.DoctorRepository;
import com.digitalclinic.appointmentsystem.repository.HospitalRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HospitalService {

    private static final Logger logger = LoggerFactory.getLogger(HospitalService.class);

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<HospitalDTO> getAllActiveHospitals() {
        logger.info("Fetching all active hospitals");
        List<Hospital> hospitals = hospitalRepository.findByIsActiveTrue();
        return hospitals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<HospitalDTO> searchHospitals(String search) {
        logger.info("Searching hospitals with query: {}", search);
        List<Hospital> hospitals = hospitalRepository.searchHospitals(search);
        return hospitals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<HospitalDTO> getHospitalsByCity(String city) {
        logger.info("Fetching hospitals in city: {}", city);
        List<Hospital> hospitals = hospitalRepository.findByCityIgnoreCaseAndIsActiveTrue(city);
        return hospitals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public HospitalDTO getHospitalById(Long id) {
        logger.info("Fetching hospital with ID: {}", id);
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + id));
        return convertToDTO(hospital);
    }

    private HospitalDTO convertToDTO(Hospital hospital) {
        HospitalDTO dto = modelMapper.map(hospital, HospitalDTO.class);
        dto.setHospitalId(hospital.getId());
        
        // Count doctors at this hospital
        Long doctorCount = doctorRepository.countByHospitalIdAndIsAvailableTrueAndIsVerifiedTrue(hospital.getId());
        dto.setDoctorCount(doctorCount.intValue());
        
        return dto;
    }
}
