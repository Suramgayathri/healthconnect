# HealthConnect Phase 3: Appointments & Booking Module

## Features Implemented
Phase 3 focuses strictly on creating, modifying, and handling patient-doctor appointments. It enables a full bidirectional cycle where Patients can book appointments and Doctors can view their schedules.

### Patient Booking Flow
1. **Directory Search**: Search for doctors based on specialty and location.
2. **Booking Formulation**: Advanced form input for reason, priority, emergency triage toggle, and preferred timings.
3. **QR Code Security Ticket**: Each appointment successfully submitted dynamically renders an entry pass (QR logic generated using ZXing on backend).
4. **My Appointments Dashboard**: Unified tabs (Pending, Confirmed, Completed) separating the queue.

### Doctor Schedule Module
1. **Dynamic Dashboard Overview**: Summarizes emergency alerts matching their profile and lists chronological appointments for the day.
2. **Schedule Manager**: Built via `FullCalendar`, plotting appointments to grid, modifying statuses inline, and issuing actions.

### Technical Elements Addressed
- **Entity**: `Appointment`, `DoctorSchedule`, `ClinicLocation`.
- **JWT Protection**: Extends the JWT validation over all endpoints relating to bookings.
- **REST APIs**: Includes comprehensive GET/POST queries linking Doctor <-> Patients.

## How to use
- Login as `PATIENT` (johndoe) to see the booking flows.
- Navigate to `appointment_booking.html?doctorId=1`
- Login as `DOCTOR` (dr_smith) to see the queue rendering on `doctor_dashboard.html`.
