# Phase 2 Implementation: Patient and Doctor Profiles

This document details the completed implementation of Phase 2 for the HealthConnect Digital Clinic Appointment System.

## Overview
Phase 2 enhances the application by building out comprehensive profile management for Patients and Doctors, including dynamic searching, scheduling entities, clinic locations, and fully integrated dashboard workflows.

## Backend Enhancements (Data & Services)
1. **Model Expansions (`Patient`, `Doctor`)**: Updated with core fields like medical history, specializations, consultation fees, and profile ratings.
2. **New Entity Models**:
   - `ClinicLocation`: Stores details of physical clinic branches (address, operating hours).
   - `DoctorLocation`: Join table matching doctors to specific clinics.
   - `DoctorSchedule`: Tracks days and time slots per clinic location.
3. **Data Transfer Objects (DTOs)**: Extensive usage of DTOs and `ModelMapper` for clean data exposure decoupled from internal JPA entities.
4. **Custom Repositories**: Advanced Query methods using Spring Data JPA (`@Query`) implemented to handle deep searching of doctors via attributes like `specialization`, `fee`, and `experience`.
5. **Robust Service Layer**: Business logic enclosed in `@Transactional` blocks (`PatientService`, `DoctorService`) handling profile generation and secure updates.

## API Endpoints Created
### Patient API (`/api/patients`) - Secured with PATIENT role
- `GET /profile` - Retrieve your own profile summary.
- `PUT /profile` - Update demographics and personal info.
- `GET /medical-history` - Fetch allergies and conditions.
- `PUT /medical-history` - Update medical historical data securely.
- `GET /stats` - User engagement overview for dashboards.

### Doctor API (`/api/doctors`) 
**Public Routes:**
- `GET /search` - Paginated and filtered search capability.
- `GET /{id}` - Public doctor detail view.
- `GET /{id}/availability` - Check booking availability by date.
- `GET /top-rated` - Fetch highlight reel of practitioners.

**Secured Routes (DOCTOR role only):**
- `GET /profile` & `PUT /profile` - Complete CRUD on bio/experience info.
- `GET /schedules` & `POST /schedule` - Manage timeslots dynamically.
- `POST /locations` - Hook doctors to multiple pre-existing clinics.

## Frontend UI Delivered
- **`patient_dashboard.html`**: The unified hub for a patient, mimicking iOS Health/Apple watch stylings. Allows checking upcoming appointments, health snapshots, and stats.
- **`doctor_search.html`**: A highly interactive, side-bar filtering search UI, debounced keyword search, responsive design out of the box.
- **`doctor_profile.html`**: In-depth doctor view showing locations, timeline slots, and reviews with a seamless booking flow UI widget layout.
- **`profile.html`**: User configuration tab system covering Personal Info, Medical Data, and Security changes.

## Database Additions
Stored under `src/main/resources/db/migration/phase2_schema.sql`, allowing quick spin-up if not utilizing Spring `ddl-auto`.

## Automated Unit Tests Added
- `DoctorServiceTest.java` - Asserts search algorithms map and filter page elements correctly, and safeguards basic profile modifications through mocking `DoctorRepository` and `ModelMapper`.

## Testing the Implementation Manually
1. Make sure to authenticate through `login.html` as a User with the `PATIENT` role.
2. Direct your browser to `patient_dashboard.html` — observe Data fetching attempts from `/api/patients/profile`.
3. Browse `doctor_search.html` to engage with mock UI fetching and dynamic population of cards.

**Next Steps (Phase 3 Prep)**: Tying the schedules we just built directly to the Appointment Entity, and wiring up the `appointment_booking.html` logic.
