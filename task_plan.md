# HealthConnect Implementation Task Plan

This task document outlines all the execution steps needed to align the project codebase to `project_work_flow_document.txt` and `schema.sql`.

## 1. Missing Entity & Schema Implementation

- [ ] **Create `Review` Component**
    - [ ] Create `Review.java` entity mapped to `reviews` table (`patient_id`, `doctor_id`, `appointment_id`, `rating`, `review_text`, `is_verified`).
    - [ ] Create `ReviewRepository.java`.
    - [ ] Create `ReviewService.java` and `ReviewController.java`.
- [ ] **Create `AuditLog` Component**
    - [ ] Create `AuditLog.java` entity mapped to `audit_logs` table (distinct from `AdminAuditLog`).
    - [ ] Map `AuditLogRepository` to the `AuditLog` entity.
- [ ] **Create `AppointmentSlot` (Missing in Schema & Code)**
    - [ ] Create a new `.sql` or update `schema.sql` to include an `appointment_slots` table: `slot_id`, `doctor_id`, `location_id`, `slot_date`, `start_time`, `end_time`, `status` ('AVAILABLE', 'BOOKED', 'BLOCKED').
    - [ ] Create `AppointmentSlot.java` entity.
    - [ ] Create `AppointmentSlotRepository.java`.
- [ ] **Verify Existing Entities vs Schema (`model/` package)**
    - [ ] Verify `Doctor` fields (e.g., `average_rating`, `total_reviews`).
    - [ ] Verify `Appointment` fields (e.g., `consultation_type`, `status` matching Enums).
    - [ ] Verify `User` fields mapping exactly to `users`.

## 2. Patient Flow Feature Implementation

- [ ] **Doctor Discovery logic**
    - [ ] Implement/Update `PatientService`/`DoctorService` to fetch doctors by specialization AND location.
- [ ] **Doctor Availability (Slot Generation)**
    - [ ] Implement `AppointmentSlotService.generateSlotsForDate(Long doctorId, Long locationId, LocalDate date)`. This should read the `DoctorSchedule` for the given day of the week, verify `is_active`, and generate 30-minute interval rows into `appointment_slots` if they don't already exist.
    - [ ] Implement `AppointmentSlotService.getAvailableSlots(Long doctorId, LocalDate date)`.
- [ ] **Booking Flow Update**
    - [ ] Update `AppointmentService.bookAppointment()` to:
        1. Receive a selected `slot_id`.
        2. Validate the `AppointmentSlot` is `AVAILABLE`.
        3. Create the `Appointment`.
        4. Update the `AppointmentSlot.status` to `BOOKED`.
- [ ] **Appointment Management**
    - [ ] Update cancel logic to revert `AppointmentSlot.status` back to `AVAILABLE`.

## 3. Doctor Flow Feature Implementation

- [ ] **Doctor Setup Flow**
    - [ ] Ensure `Doctor.is_verified` properly blocks login/appointment generation.
    - [ ] Verify/Implement logic to set `DoctorLocation` (mapping doctor to `ClinicLocation`).
    - [ ] Verify/Implement logic to create `DoctorSchedule` (defining availability per location).
- [ ] **Consultations & Records**
    - [ ] Implement endpoints for doctors to record `PatientVitals`.
    - [ ] Implement endpoints to issue `Prescription` and `PrescriptionMedication`.
- [ ] **Schedule Modification Flow**
    - [ ] Update logic: If a doctor modifies a `DoctorSchedule`, find affected *future* `appointment_slots` and mark them `BLOCKED` or `CANCELLED`. Notify patients (hook into `NotificationService`).

## 4. Admin Flow Feature Implementation

- [ ] **Doctor Approvals**
    - [ ] Verify `AdminUserController` has `approveDoctor()` updating `is_verified`.
- [ ] **System Monitoring**
    - [ ] Verify `AnalyticsService` properly reads `appointments` and `payments` to fetch system-wide revenue and completion stats.
