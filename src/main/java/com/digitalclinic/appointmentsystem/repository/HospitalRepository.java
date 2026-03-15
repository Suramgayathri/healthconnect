package com.digitalclinic.appointmentsystem.repository;

import com.digitalclinic.appointmentsystem.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    List<Hospital> findByIsActiveTrue();

    List<Hospital> findByCityIgnoreCaseAndIsActiveTrue(String city);

    @Query("SELECT h FROM Hospital h WHERE " +
            "h.isActive = true AND " +
            "(LOWER(h.hospitalName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(h.city) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(h.hospitalAddress) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Hospital> searchHospitals(@Param("search") String search);

    List<Hospital> findByHospitalNameContainingIgnoreCaseAndIsActiveTrue(String name);

    Long countByIsActiveTrue();
}
