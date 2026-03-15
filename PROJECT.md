I'll analyze your project structure and generate a comprehensive prompt. Let me explore the key files to understand the full workflow.



Let me continue exploring more files to get a complete picture.



Let me read a few more files to complete the picture.



Based on my analysis of your project, here's a comprehensive prompt that explains the full workflow and structure:

---

# HealthConnect Digital Clinic - Complete Project Overview

## Project Architecture

**Type**: Full-stack web application for digital clinic appointment management  
**Backend**: Spring Boot (Java 17+) with Spring Security, JPA/Hibernate  
**Frontend**: Vanilla HTML/CSS/JavaScript with Bootstrap and custom styling  
**Database**: MySQL with Flyway migrations  
**Authentication**: JWT-based authentication with BCrypt password hashing  
**Real-time**: WebSocket support for notifications  
**Deployment**: Maven-based build with embedded Tomcat

---

## Database Schema

### Core Tables (18 total)

1. **users** - Base user entity with role-based access (PATIENT/DOCTOR/ADMIN)
2. **patients** - Patient-specific profile linked to users
3. **doctors** - Doctor profile with verification status and credentials
4. **clinic_locations** - Physical clinic locations with coordinates
5. **doctor_locations** - Many-to-many mapping of doctors to clinics
6. **doctor_schedules** - Weekly availability with time slots
7. **appointments** - Main booking entity with status tracking
8. **patient_vitals** - Vital signs recorded during appointments
9. **prescriptions** - Doctor prescriptions linked to appointments
10. **prescription_medications** - Medication details within prescriptions
11. **lab_tests** - Laboratory test orders and results
12. **medical_records** - Document storage references
13. **payments** - Payment transactions for appointments
14. **notifications** - Multi-channel notification system
15. **reviews** - Patient reviews for doctors
16. **audit_logs** - System-wide audit trail
17. **admin_audit_logs** - Admin-specific action logging
18. **system_settings** - Configurable platform settings

---

## Architecture Layers

### Backend Structure
```
com.digitalclinic.appointmentsystem/
├── controller/     # REST API endpoints
├── service/        # Business logic layer
├── repository/     # JPA repositories
├── model/          # JPA entities
├── dto/            # Data Transfer Objects
├── config/         # Configuration classes
├── security/       # Authentication & authorization
└── utils/          # Helper classes
```

### Frontend Structure
```
src/main/resources/static/
├── *.html          # Page templates
├── css/            # Stylesheets
├── js/             # Client-side JavaScript
├── uploads/        # File uploads (prescriptions, records)
└── images/         # Static assets
```

---

## User Roles & Permissions

### 1. PATIENT
- Register/login via email/phone
- Search and book appointments
- View medical records and prescriptions
- Upload medical documents
- Rate and review doctors
- Access emergency booking
- View appointment QR codes

### 2. DOCTOR
- Register with credentials (pending admin verification)
- Manage schedule and availability
- View patient appointments
- Update appointment status
- Create prescriptions and lab orders
- Access patient medical history
- View patient vitals

### 3. ADMIN
- Approve/reject doctor registrations
- Manage all users
- View system analytics
- Configure system settings
- Monitor audit logs
- Access revenue reports

---

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - Authentication with JWT response
- `GET /profile` - Get authenticated user profile

### Doctor Registration (`/api/auth`)
- `POST /register/doctor` - Doctor registration with file upload

### Patient Management (`/api/patients`)
- `GET /profile` - Get patient profile
- `PUT /profile` - Update patient profile
- `GET /medical-history` - Get medical history
- `PUT /medical-history` - Update medical history
- `GET /stats` - Get patient statistics

### Doctor Management (`/api/doctors`)
- `GET /search` - Search doctors with filters
- `GET /{id}` - Get doctor profile
- `GET /{id}/availability` - Get available slots
- `GET /specialization/{spec}` - Filter by specialization
- `GET /top-rated` - Get top-rated doctors
- `GET /profile` - Get my profile (doctor)
- `PUT /profile` - Update my profile
- `GET /schedules` - Get my schedules
- `POST /schedule` - Create/update schedule
- `DELETE /schedule/{id}` - Delete schedule
- `POST /locations` - Add clinic location

### Appointments (`/api/appointments`)
- `POST /` - Book appointment
- `POST /emergency` - Book emergency appointment
- `GET /patient` - Get my appointments (patient)
- `GET /doctor` - Get my appointments (doctor)
- `GET /doctor/schedule` - Get daily schedule
- `DELETE /{id}` - Cancel appointment
- `PUT /{id}/reschedule` - Reschedule appointment
- `PUT /{id}/status` - Update appointment status
- `GET /{id}` - Get appointment details
- `GET /slots` - Get available slots
- `GET /{id}/qrcode` - Get appointment QR code

### Admin Management (`/api/admin/users`)
- `GET /` - Get all users (paginated)
- `GET /patients` - Get all patients
- `GET /doctors` - Get all doctors
- `PATCH /{userId}/toggle-status` - Toggle user status
- `PATCH /doctors/{doctorId}/approve` - Approve doctor
- `PATCH /doctors/{doctorId}/reject` - Reject doctor

### Payments (`/api/payments`)
- `POST /create-intent` - Create payment intent
- `POST /confirm` - Confirm payment

### Medical Records (`/api/records`)
- `POST /upload` - Upload medical document
- `GET /patient/{patientId}` - Get patient records
- `GET /{id}` - Get record by ID
- `GET /download/{fileName}` - Download file

### Prescriptions (`/api/prescriptions`)
- `POST /` - Create prescription
- `GET /patient/{patientId}` - Get patient prescriptions
- `GET /{id}` - Get prescription by ID
- `GET /download/{fileName}` - Download prescription PDF

### Notifications (`/api/notifications`)
- `GET /user/{userId}` - Get user notifications
- `GET /user/{userId}/unread-count` - Get unread count
- `POST /{notificationId}/read` - Mark as read
- `POST /user/{userId}/read-all` - Mark all as read

### Analytics (`/api/admin/analytics`)
- `GET /metrics` - Get dashboard metrics
- `GET /dashboard` - Get dashboard data
- `GET /trends` - Get appointment trends
- `GET /export/csv` - Export CSV report

---

## Screens & Mapped HTML Files

### Authentication Pages
| Screen | File | Purpose |
|--------|------|---------|
| Login | `login.html` | User authentication |
| Register Patient | `register_patient.html` | Patient registration |
| Register Doctor | `register_doctor.html` | Doctor registration |
| Forgot Password | `forgot_password.html` | Password recovery |

### Dashboard Pages
| Screen | File | Purpose |
|--------|------|---------|
| Patient Dashboard | `patient_dashboard.html` | Patient main dashboard |
| Doctor Dashboard | `doctor_dashboard.html` | Doctor main dashboard |
| Admin Dashboard | `admin_dashboard.html` | Admin overview |

### Appointment Pages
| Screen | File | Purpose |
|--------|------|---------|
| Book Appointment | `appointment_booking.html` | Appointment booking interface |
| Appointment List | `appointment_list.html` | View all appointments |
| Appointment Details | `appointment_details.html` | Appointment details view |
| Doctor Schedule | `doctor_schedule.html` | Doctor schedule management |

### Search & Profile
| Screen | File | Purpose |
|--------|------|---------|
| Doctor Search | `doctor_search.html` | Find doctors by specialty |
| Patient Profile | `profile.html` | Patient profile management |
| Doctor Profile | `doctor_profile.html` | Doctor profile view |

### Medical Records
| Screen | File | Purpose |
|--------|------|---------|
| Medical Records | `medical_records.html` | View medical history |
| Prescription View | `prescription_view.html` | View prescriptions |

### Admin Pages
| Screen | File | Purpose |
|--------|------|---------|
| Admin Users | `admin_users.html` | User management |
| Admin Reports | `admin_reports.html` | Analytics and reports |
| Admin Settings | `admin_settings.html` | System configuration |

---

## API Request/Response Examples

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": 4,
    "email": "john.doe@gmail.com",
    "role": "PATIENT",
    "isActive": true
  }
}
```

### Search Doctors Response
```json
{
  "content": [
    {
      "doctorId": 1,
      "fullName": "Dr. John Smith",
      "specialization": "Cardiology",
      "qualifications": "MBBS, MD (Cardiology)",
      "experienceYears": 15,
      "consultationFee": 150.00,
      "averageRating": 4.8,
      "isVerified": true,
      "isAvailable": true,
      "profilePhoto": "/uploads/doctors/1_photo.jpg"
    }
  ],
  "totalElements": 1,
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  }
}
```

### Book Appointment Request
```json
{
  "doctorId": 1,
  "locationId": 1,
  "appointmentDate": "2026-03-15",
  "appointmentTime": "10:00",
  "consultationType": "IN_PERSON",
  "reasonForVisit": "Regular checkup",
  "isEmergency": false
}
```

### Book Appointment Response
```json
{
  "id": 1,
  "bookingReference": "APT-1710489600000-123",
  "patientId": 1,
  "doctorId": 1,
  "locationId": 1,
  "appointmentDate": "2026-03-15",
  "appointmentTime": "10:00:00",
  "consultationType": "IN_PERSON",
  "status": "SCHEDULED",
  "consultationFee": 150.00,
  "paymentStatus": "PENDING"
}
```

### Get Patient Profile Response
```json
{
  "patientId": 1,
  "fullName": "John Doe",
  "email": "john.doe@gmail.com",
  "phone": "+1234567893",
  "dob": "1985-06-15",
  "gender": "MALE",
  "bloodGroup": "O+",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "pincode": "10001",
  "emergencyContact": "+1234567895",
  "allergies": "None",
  "chronicConditions": "None",
  "medicalHistory": "No major medical history"
}
```

---

## Workflow Overview

### 1. User Registration Flow
1. User visits registration page
2. Selects role (Patient/Doctor)
3. Fills registration form
4. System validates uniqueness of email/phone
5. Creates user account with hashed password
6. Creates role-specific profile
7. Returns success message

### 2. Appointment Booking Flow
1. Patient searches for doctor
2. Views doctor profile and availability
3. Selects date and location
4. Chooses time slot
5. Fills consultation details
6. System creates appointment record
7. Generates booking reference
8. Sends confirmation notifications

### 3. Doctor Verification Flow
1. Doctor registers with credentials
2. Admin reviews registration
3. Admin approves or rejects
4. System updates verification status
5. Doctor receives notification
6. Verified doctors appear in search results

### 4. Emergency Booking Flow
1. Patient selects emergency option
2. System prompts for urgency details
3. Triage algorithm prioritizes case
4. System finds earliest available slot
5. Creates appointment with emergency flag
6. Notifies doctor of emergency case

### 5. Prescription Flow
1. Doctor completes consultation
2. Creates prescription with medications
3. System saves prescription record
4. Patient receives notification
5. Patient can view/download prescription

---

## Technology Stack

### Backend
- Spring Boot 3.x
- Spring Security (JWT, BCrypt)
- Spring Data JPA (Hibernate)
- MySQL 8.0
- Flyway (Database migrations)
- Lombok (Code generation)
- Maven (Build tool)

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- Font Awesome 6
- Chart.js (Analytics)
- FullCalendar (Schedule management)
- SockJS + STOMP (WebSocket)

### Deployment
- Maven wrapper
- Embedded Tomcat
- Static resource serving
- File upload handling

---

This prompt provides a complete overview of your HealthConnect digital clinic system, covering architecture, database, roles, APIs, and workflows.