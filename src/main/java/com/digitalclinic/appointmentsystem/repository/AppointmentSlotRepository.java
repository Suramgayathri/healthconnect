package com.digitalclinic.appointmentsystem.repository;

import com.digitalclinic.appointmentsystem.model.AppointmentSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, Long> {
    
    List<AppointmentSlot> findByDoctorIdAndSlotDateOrderByStartTime(Long doctorId, LocalDate slotDate);
    
    List<AppointmentSlot> findByDoctorIdAndLocationIdAndSlotDateOrderByStartTime(Long doctorId, Long locationId, LocalDate slotDate);
    
    List<AppointmentSlot> findByDoctorIdAndSlotDateAndStatusOrderByStartTime(Long doctorId, LocalDate slotDate, AppointmentSlot.SlotStatus status);
}
