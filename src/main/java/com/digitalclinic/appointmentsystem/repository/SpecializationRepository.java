package com.digitalclinic.appointmentsystem.repository;

import com.digitalclinic.appointmentsystem.model.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecializationRepository extends JpaRepository<Specialization, Long> {
}
