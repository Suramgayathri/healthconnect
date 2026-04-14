package com.digitalclinic.appointmentsystem.service;

import com.digitalclinic.appointmentsystem.model.Specialization;
import com.digitalclinic.appointmentsystem.repository.SpecializationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecializationService {

    @Autowired
    private SpecializationRepository specializationRepository;

    public List<Specialization> getAllSpecializations() {
        return specializationRepository.findAll();
    }
}
