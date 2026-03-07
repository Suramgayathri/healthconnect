package com.digitalclinic.appointmentsystem.repository;

import com.digitalclinic.appointmentsystem.model.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

        Optional<Appointment> findByBookingReference(String bookingReference);

        Page<Appointment> findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(Long patientId,
                        Pageable pageable);

        Page<Appointment> findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(Long doctorId, Pageable pageable);

        @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date ORDER BY a.appointmentTime ASC")
        List<Appointment> findDoctorAppointmentsForDate(@Param("doctorId") Long doctorId,
                        @Param("date") LocalDate date);

        @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date AND a.status = :status ORDER BY a.appointmentTime ASC")
        List<Appointment> findDoctorAppointmentsByDateAndStatus(
                        @Param("doctorId") Long doctorId,
                        @Param("date") LocalDate date,
                        @Param("status") Appointment.AppointmentStatus status);

        long countByPatientIdAndStatus(Long patientId, Appointment.AppointmentStatus status);

        long countByDoctorIdAndAppointmentDateAndStatus(Long doctorId, LocalDate date,
                        Appointment.AppointmentStatus status);

        boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                        Long doctorId, LocalDate date, LocalTime time, Appointment.AppointmentStatus status);

        List<Appointment> findByPatientId(Long patientId);

        List<Appointment> findByDoctorId(Long doctorId);

        List<Appointment> findByAppointmentDateBetween(LocalDate startDate, LocalDate endDate);

        List<Appointment> findByStatus(Appointment.AppointmentStatus status);

        List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate appointmentDate);

        List<Appointment> findByIsEmergencyTrue();

        long countByDoctorIdAndAppointmentDateAndAppointmentTimeBetweenAndStatusNot(
                        Long doctorId, LocalDate date, LocalTime startTime, LocalTime endTime,
                        Appointment.AppointmentStatus status);
}
