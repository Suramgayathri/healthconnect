package com.digitalclinic.appointmentsystem.service;

import com.digitalclinic.appointmentsystem.dto.DoctorProfileDTO;
import com.digitalclinic.appointmentsystem.dto.DoctorSearchDTO;
import com.digitalclinic.appointmentsystem.dto.DoctorScheduleDTO;
import com.digitalclinic.appointmentsystem.dto.ClinicLocationDTO;
import com.digitalclinic.appointmentsystem.model.Doctor;
import com.digitalclinic.appointmentsystem.model.DoctorLocation;
import com.digitalclinic.appointmentsystem.model.DoctorSchedule;
import com.digitalclinic.appointmentsystem.model.ClinicLocation;
import com.digitalclinic.appointmentsystem.repository.DoctorRepository;
import com.digitalclinic.appointmentsystem.repository.DoctorLocationRepository;
import com.digitalclinic.appointmentsystem.repository.DoctorScheduleRepository;
import com.digitalclinic.appointmentsystem.repository.ClinicLocationRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DoctorService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorService.class);

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorLocationRepository doctorLocationRepository;

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Autowired
    private ClinicLocationRepository clinicLocationRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Page<DoctorProfileDTO> searchDoctors(DoctorSearchDTO searchDTO) {
        logger.info("Searching doctors with filters");

        Sort sort = Sort.by(Sort.Direction.DESC, "averageRating");
        if ("fee".equalsIgnoreCase(searchDTO.getSortBy())) {
            sort = Sort.by(Sort.Direction.ASC, "consultationFee");
        } else if ("experience".equalsIgnoreCase(searchDTO.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "experienceYears");
        }

        Pageable pageable = PageRequest.of(searchDTO.getPage(), searchDTO.getSize(), sort);

        Page<Doctor> doctors = doctorRepository.searchDoctors(
                searchDTO.getSpecialization(),
                searchDTO.getMinExperience(),
                searchDTO.getMaxFee(),
                pageable);

        return doctors.map(this::convertToProfileDTO);
    }

    public DoctorProfileDTO getDoctorProfile(Long doctorId) {
        logger.info("Fetching doctor profile ID: {}", doctorId);
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return convertToProfileDTO(doctor);
    }

    public DoctorProfileDTO getMyProfile(Long userId) {
        logger.info("Fetching doctor profile for user ID: {}", userId);
        Doctor doctor = doctorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        return convertToProfileDTO(doctor);
    }

    public DoctorProfileDTO updateDoctorProfile(Long userId, DoctorProfileDTO dto) {
        logger.info("Updating doctor profile for user ID: {}", userId);
        Doctor doctor = doctorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        doctor.setFullName(dto.getFullName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualifications(dto.getQualifications());
        doctor.setExperienceYears(dto.getExperienceYears());
        doctor.setLicenseNumber(dto.getLicenseNumber());
        doctor.setAbout(dto.getAbout());
        doctor.setLanguagesSpoken(dto.getLanguagesSpoken());
        doctor.setConsultationFee(dto.getConsultationFee());
        doctor.setProfilePhoto(dto.getProfilePhoto());

        if (dto.isAvailable() != doctor.isAvailable()) {
            doctor.setAvailable(dto.isAvailable());
        }

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return convertToProfileDTO(updatedDoctor);
    }

    public void addClinicLocation(Long userId, Long locationId, BigDecimal fee, boolean isPrimary) {
        logger.info("Adding clinic location {} for doctor user ID {}", locationId, userId);
        Doctor doctor = doctorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        ClinicLocation location = clinicLocationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        DoctorLocation doctorLocation = DoctorLocation.builder()
                .doctor(doctor)
                .location(location)
                .consultationFee(fee)
                .isPrimary(isPrimary)
                .build();

        doctorLocationRepository.save(doctorLocation);
    }

    public void removeClinicLocation(Long userId, Long locationId) {
        logger.info("Removing clinic location {} for doctor user ID {}", locationId, userId);
        Doctor doctor = doctorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        DoctorLocation doctorLocation = doctorLocationRepository.findByDoctorIdAndLocationId(doctor.getId(), locationId)
                .orElseThrow(() -> new RuntimeException("DoctorLocation not found"));
        doctorLocationRepository.delete(doctorLocation);
    }

    public List<DoctorScheduleDTO> getDoctorSchedules(Long doctorId) {
        logger.info("Fetching schedules for doctor ID: {}", doctorId);
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctorId(doctorId);
        return schedules.stream()
                .map(this::convertToScheduleDTO)
                .collect(Collectors.toList());
    }

    public DoctorScheduleDTO createOrUpdateSchedule(Long userId, DoctorScheduleDTO scheduleDTO) {
        logger.info("Creating or updating schedule for doctor user ID: {}", userId);
        Doctor doctor = doctorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        ClinicLocation location = clinicLocationRepository.findById(scheduleDTO.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        DoctorSchedule schedule = doctorScheduleRepository.findByDoctorIdAndLocationIdAndDayOfWeek(
                doctor.getId(), location.getId(),
                DoctorSchedule.DayOfWeek.valueOf(scheduleDTO.getDayOfWeek().toUpperCase()))
                .orElse(new DoctorSchedule());

        schedule.setDoctor(doctor);
        schedule.setLocation(location);
        schedule.setDayOfWeek(DoctorSchedule.DayOfWeek.valueOf(scheduleDTO.getDayOfWeek().toUpperCase()));
        schedule.setStartTime(scheduleDTO.getStartTime());
        schedule.setEndTime(scheduleDTO.getEndTime());
        schedule.setSlotDuration(scheduleDTO.getSlotDuration());
        schedule.setBreakStartTime(scheduleDTO.getBreakStartTime());
        schedule.setBreakEndTime(scheduleDTO.getBreakEndTime());
        schedule.setActive(scheduleDTO.isActive());

        DoctorSchedule savedSchedule = doctorScheduleRepository.save(schedule);
        return convertToScheduleDTO(savedSchedule);
    }

    public void deleteSchedule(Long userId, Long scheduleId) {
        logger.info("Deleting schedule ID: {} for user ID: {}", scheduleId, userId);
        Doctor doctor = doctorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        DoctorSchedule schedule = doctorScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        if (!schedule.getDoctor().getId().equals(doctor.getId())) {
            throw new RuntimeException("Unauthorized to delete this schedule");
        }

        doctorScheduleRepository.delete(schedule);
    }

    public List<String> getAvailableSlots(Long doctorId, Long locationId, LocalDate date) {
        logger.info("Fetching available slots for doc {}, loc {}, date {}", doctorId, locationId, date);
        DoctorSchedule.DayOfWeek day = DoctorSchedule.DayOfWeek.valueOf(date.getDayOfWeek().name());

        DoctorSchedule schedule = doctorScheduleRepository.findActiveSchedule(doctorId, day)
                .orElseThrow(() -> new RuntimeException("No schedule available for this day"));

        List<String> slots = new ArrayList<>();
        LocalTime current = schedule.getStartTime();
        LocalTime end = schedule.getEndTime();
        int duration = schedule.getSlotDuration();

        while (current.isBefore(end)) {
            // Simplified: skip break times
            if (schedule.getBreakStartTime() != null && schedule.getBreakEndTime() != null) {
                if (!current.isBefore(schedule.getBreakStartTime()) && current.isBefore(schedule.getBreakEndTime())) {
                    current = current.plusMinutes(duration);
                    continue;
                }
            }
            slots.add(current.toString());
            current = current.plusMinutes(duration);
        }

        return slots;
    }

    public List<DoctorProfileDTO> getDoctorsBySpecialization(String specialization) {
        logger.info("Fetching doctors by specialty: {}", specialization);
        return doctorRepository.findBySpecialization(specialization).stream()
                .map(this::convertToProfileDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorProfileDTO> getTopRatedDoctors(int limit) {
        logger.info("Fetching top rated doctors, limit: {}", limit);
        Pageable pageable = PageRequest.of(0, limit);
        return doctorRepository.findTopRatedDoctors(BigDecimal.valueOf(4.0), pageable).stream()
                .map(this::convertToProfileDTO)
                .collect(Collectors.toList());
    }

    private DoctorProfileDTO convertToProfileDTO(Doctor doctor) {
        DoctorProfileDTO dto = modelMapper.map(doctor, DoctorProfileDTO.class);
        dto.setDoctorId(doctor.getId());
        if (doctor.getUser() != null) {
            dto.setEmail(doctor.getUser().getEmail());
        }
        // Fetch locations and schedules explicitly if needed
        return dto;
    }

    private DoctorScheduleDTO convertToScheduleDTO(DoctorSchedule schedule) {
        DoctorScheduleDTO dto = modelMapper.map(schedule, DoctorScheduleDTO.class);
        dto.setScheduleId(schedule.getId());
        dto.setLocationId(schedule.getLocation().getId());
        dto.setClinicName(schedule.getLocation().getClinicName());
        dto.setDayOfWeek(schedule.getDayOfWeek().name());
        return dto;
    }
}
