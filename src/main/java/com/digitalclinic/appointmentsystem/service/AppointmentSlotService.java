package com.digitalclinic.appointmentsystem.service;

import com.digitalclinic.appointmentsystem.model.AppointmentSlot;
import com.digitalclinic.appointmentsystem.model.ClinicLocation;
import com.digitalclinic.appointmentsystem.model.Doctor;
import com.digitalclinic.appointmentsystem.model.DoctorSchedule;
import com.digitalclinic.appointmentsystem.repository.AppointmentSlotRepository;
import com.digitalclinic.appointmentsystem.repository.DoctorRepository;
import com.digitalclinic.appointmentsystem.repository.DoctorScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentSlotService {

    @Autowired
    private AppointmentSlotRepository slotRepository;

    @Autowired
    private DoctorScheduleRepository scheduleRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Transactional
    public List<AppointmentSlot> generateSlotsForDate(Long doctorId, Long locationId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!doctor.getIsVerified() || !doctor.getIsAvailable()) {
            throw new RuntimeException("Doctor is not available or verified for scheduling");
        }

        // Fetch all currently existing slots in DB
        List<AppointmentSlot> existingSlots = slotRepository
                .findByDoctorIdAndLocationIdAndSlotDateOrderByStartTime(doctorId, locationId, date);

        // Find applicable schedule for the day of week
        String dayOfWeek = date.getDayOfWeek().name();
        
        List<DoctorSchedule> schedules = scheduleRepository.findByDoctorId(doctorId);
        DoctorSchedule activeSchedule = schedules.stream()
                .filter(s -> s.getLocation().getId().equals(locationId))
                .filter(s -> s.getDayOfWeek().name().equals(dayOfWeek))
                .filter(DoctorSchedule::isActive)
                .findFirst()
                .orElse(null);

        // ALWAYS delete the old 'AVAILABLE' slots before validating the schedule.
        // This ensures if a schedule changed, old unused slots are purged.
        List<AppointmentSlot> availableSlots = existingSlots.stream()
                .filter(s -> s.getStatus() == AppointmentSlot.SlotStatus.AVAILABLE)
                .collect(Collectors.toList());
        
        if (!availableSlots.isEmpty()) {
            slotRepository.deleteAll(availableSlots);
            existingSlots.removeAll(availableSlots); // existingSlots now only has BOOKED/BLOCKED
        }

        if (activeSchedule == null) {
            // Schedule was inactive or doesn't exist. All open availabilities are now purged.
            return existingSlots; 
        }

        List<AppointmentSlot> generatedSlots = new ArrayList<>();
        LocalTime currentTime = activeSchedule.getStartTime();
        LocalTime endTime = activeSchedule.getEndTime();
        int duration = activeSchedule.getSlotDuration();

        while (currentTime.plusMinutes(duration).isBefore(endTime) || currentTime.plusMinutes(duration).equals(endTime)) {
            
            final LocalTime slotC = currentTime;
            // Check if this time collides with an already BOOKED appointment
            boolean isOccupied = existingSlots.stream().anyMatch(s -> 
                    s.getStartTime().equals(slotC) || 
                    (slotC.isAfter(s.getStartTime()) && slotC.isBefore(s.getEndTime())));
            
            if (!isOccupied) {
                // Must also skip break times
                boolean isBreakTime = false;
                if (activeSchedule.getBreakStartTime() != null && activeSchedule.getBreakEndTime() != null) {
                    if (!slotC.isBefore(activeSchedule.getBreakStartTime()) && slotC.isBefore(activeSchedule.getBreakEndTime())) {
                        isBreakTime = true;
                    }
                }
                
                if (!isBreakTime) {
                    AppointmentSlot slot = AppointmentSlot.builder()
                            .doctor(doctor)
                            .location(activeSchedule.getLocation())
                            .slotDate(date)
                            .startTime(slotC)
                            .endTime(slotC.plusMinutes(duration))
                            .status(AppointmentSlot.SlotStatus.AVAILABLE)
                            .build();
                    generatedSlots.add(slot);
                }
            }
            
            currentTime = currentTime.plusMinutes(duration);
        }

        List<AppointmentSlot> saved = slotRepository.saveAll(generatedSlots);
        saved.addAll(existingSlots);
        saved.sort(Comparator.comparing(AppointmentSlot::getStartTime));
        return saved;
    }

    public List<AppointmentSlot> getAvailableSlots(Long doctorId, LocalDate date) {
        return slotRepository.findByDoctorIdAndSlotDateAndStatusOrderByStartTime(
                doctorId, date, AppointmentSlot.SlotStatus.AVAILABLE);
    }
}
