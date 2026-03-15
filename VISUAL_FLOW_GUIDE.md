# 🎨 Visual Flow Guide - Hospital Booking System

## Complete User Journey with Screenshots

### Step 1: Patient Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  HealthConnect - Patient Dashboard                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Welcome, John Doe!                                     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ My           │  │ Find         │  │ Medical      │ │
│  │ Appointments │  │ Hospitals 🏥 │  │ Records      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
**Action:** Click "Find Hospitals" button

---

### Step 2: Hospital Search Page
```
┌─────────────────────────────────────────────────────────┐
│  Find Nearby Hospitals                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📍 [Enter location...        ] [Use My Location 📍]   │
│                                                         │
│  Loading nearby hospitals...                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
**Action:** Click "Use My Location"

---

### Step 3: Hospital Results
```
┌─────────────────────────────────────────────────────────┐
│  Nearby Hospitals (5 found)                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ [Hospital Photo]                               │    │
│  │ Apollo Hospitals                               │    │
│  │ 🚩 Emergency                                   │    │
│  ├────────────────────────────────────────────────┤    │
│  │ 📍 1.2 km away                                 │    │
│  │ 📍 Main Road, City Center                      │    │
│  │ ☎️  +91-123-456-7890                           │    │
│  │ 🛏️  200 beds                                   │    │
│  ├────────────────────────────────────────────────┤    │
│  │ [📅 Book Appointment] [🗺️ Directions]          │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ [Hospital Photo]                               │    │
│  │ City General Hospital                          │    │
│  │ Hospital                                       │    │
│  ├────────────────────────────────────────────────┤    │
│  │ 📍 2.5 km away                                 │    │
│  │ 📍 123 Main Street, Downtown                   │    │
│  │ ☎️  +91-987-654-3210                           │    │
│  ├────────────────────────────────────────────────┤    │
│  │ [📅 Book Appointment] [🗺️ Directions]          │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
**Action:** Click "Book Appointment" on Apollo Hospitals

---

### Step 4: Doctor Selection Modal
```
┌─────────────────────────────────────────────────────────┐
│  👨‍⚕️ Select a Doctor                              [✕]   │
├─────────────────────────────────────────────────────────┤
│  🏥 Booking for Apollo Hospitals                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  [👨‍⚕️]  Dr. Ramesh Kumar                        │    │
│  │         Cardiologist                           │    │
│  │         💼 10 years experience                 │    │
│  │         💰 ₹500 consultation fee               │    │
│  │         ✅ Available                           │    │
│  │         [🕐 View Available Slots]              │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  [👩‍⚕️]  Dr. Priya Sharma                        │    │
│  │         Neurologist                            │    │
│  │         💼 8 years experience                  │    │
│  │         💰 ₹600 consultation fee               │    │
│  │         ✅ Available                           │    │
│  │         [🕐 View Available Slots]              │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  [👨‍⚕️]  Dr. Anil Verma                          │    │
│  │         Orthopedic Surgeon                     │    │
│  │         💼 15 years experience                 │    │
│  │         💰 ₹700 consultation fee               │    │
│  │         ✅ Available                           │    │
│  │         [🕐 View Available Slots]              │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
**Action:** Click "View Available Slots" for Dr. Ramesh Kumar

---

### Step 5: Time Slot Selection Modal
```
┌─────────────────────────────────────────────────────────┐
│  📅 Select Appointment Time                       [✕]   │
├─────────────────────────────────────────────────────────┤
│  Dr. Ramesh Kumar                                       │
│  Wednesday, March 12, 2026                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Morning Slots:                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ 🕐 9:00  │ │ 🕐 9:30  │ │ 🕐 10:00 │ │ 🕐 10:30 │  │
│  │   AM     │ │   AM     │ │   AM     │ │   AM     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  ┌──────────┐ ┌──────────┐                             │
│  │ 🕐 11:00 │ │ 🕐 11:30 │                             │
│  │   AM     │ │   AM     │                             │
│  └──────────┘ └──────────┘                             │
│                                                         │
│  Afternoon Slots:                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ 🕐 2:00  │ │ 🕐 2:30  │ │ 🕐 3:00  │ │ 🕐 3:30  │  │
│  │   PM     │ │   PM     │ │   PM     │ │   PM     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ 🕐 4:00  │ │ 🕐 4:30  │ │ 🕐 5:00  │ │ 🕐 5:30  │  │
│  │   PM     │ │   PM     │ │   PM     │ │   PM     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
**Action:** Click "10:00 AM" slot

---

### Step 6: Creating Appointment (Loading)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    ⏳ Loading...                        │
│                                                         │
│              Creating your appointment...               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
**Backend:** POST /api/appointments

---

### Step 7: Confirmation Screen
```
┌─────────────────────────────────────────────────────────┐
│  ✅ Appointment Confirmed!                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    📅                                   │
│                                                         │
│         Your appointment is confirmed                   │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  Doctor:         Dr. Ramesh Kumar              │    │
│  │  Date:           Wednesday, March 12, 2026     │    │
│  │  Time:           10:00 AM                      │    │
│  │  Appointment ID: #12345                        │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  A confirmation has been sent to your email.            │
│                                                         │
│  [🔍 Find More Hospitals] [📋 View My Appointments]    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
**Success!** Appointment created in database

---

## Edge Case Scenarios

### Scenario A: No Doctors at Hospital
```
┌─────────────────────────────────────────────────────────┐
│  ℹ️ No Doctors Found                              [✕]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    👨‍⚕️                                   │
│                                                         │
│  No doctors are currently registered at                 │
│  Fortis Healthcare.                                     │
│                                                         │
│  Would you like to see all available doctors instead?   │
│                                                         │
│  [Cancel] [View All Doctors]                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Scenario B: No Available Slots
```
┌─────────────────────────────────────────────────────────┐
│  📅 No Slots Available                            [✕]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    📅                                   │
│                                                         │
│  Dr. Ramesh Kumar has no available slots                │
│  for tomorrow.                                          │
│                                                         │
│  Please try selecting a different date or doctor.       │
│                                                         │
│  [← Back to Doctors]                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Scenario C: Not Logged In
```
┌─────────────────────────────────────────────────────────┐
│  Redirecting to login...                                │
│                                                         │
│  Please login to book appointments                      │
└─────────────────────────────────────────────────────────┘
```

---

## Technical Flow Diagram

```
┌─────────────┐
│   USER      │
└──────┬──────┘
       │
       │ 1. Click "Find Hospitals"
       ▼
┌─────────────────────────┐
│  OpenStreetMap API      │
│  (Overpass)             │
└──────┬──────────────────┘
       │
       │ 2. Returns nearby hospitals
       ▼
┌─────────────────────────┐
│  Hospital Cards         │
│  with "Book" button     │
└──────┬──────────────────┘
       │
       │ 3. Click "Book Appointment"
       ▼
┌─────────────────────────┐
│  GET /api/doctors       │
│  ?hospital=Apollo       │
└──────┬──────────────────┘
       │
       │ 4. Returns doctors at hospital
       ▼
┌─────────────────────────┐
│  Doctor Selection       │
│  Modal                  │
└──────┬──────────────────┘
       │
       │ 5. Click "View Available Slots"
       ▼
┌─────────────────────────┐
│  GET /api/doctors/1/    │
│  availability           │
└──────┬──────────────────┘
       │
       │ 6. Returns time slots
       ▼
┌─────────────────────────┐
│  Time Slot Grid         │
│  Modal                  │
└──────┬──────────────────┘
       │
       │ 7. Click time slot
       ▼
┌─────────────────────────┐
│  POST /api/appointments │
└──────┬──────────────────┘
       │
       │ 8. Creates appointment
       ▼
┌─────────────────────────┐
│  MySQL Database         │
│  appointments table     │
└──────┬──────────────────┘
       │
       │ 9. Returns appointment ID
       ▼
┌─────────────────────────┐
│  Confirmation Screen    │
└─────────────────────────┘
```

---

## Data Flow

### Request 1: Get Doctors by Hospital
```
Frontend                    Backend                     Database
────────                    ───────                     ────────

bookAppointment()
    │
    │ GET /api/doctors?hospital=Apollo
    ├──────────────────────────────────>
    │                                   DoctorController
    │                                        │
    │                                        │ getDoctorsByHospital()
    │                                        ├──────────────────────>
    │                                        │                       DoctorService
    │                                        │                            │
    │                                        │                            │ findByHospitalName...()
    │                                        │                            ├──────────────────────>
    │                                        │                            │                       SELECT * FROM doctors
    │                                        │                            │                       WHERE hospital_name LIKE '%Apollo%'
    │                                        │                            │<──────────────────────
    │                                        │                            │ List<Doctor>
    │                                        │<──────────────────────
    │                                        │ List<DoctorProfileDTO>
    │<──────────────────────────────────
    │ JSON: [{id:1, name:"Dr. Ramesh"...}]
    │
showDoctorSelectionModal()
```

### Request 2: Get Available Slots
```
Frontend                    Backend                     Database
────────                    ───────                     ────────

viewAvailableSlots()
    │
    │ GET /api/doctors/1/availability?date=2026-03-12
    ├──────────────────────────────────>
    │                                   DoctorController
    │                                        │
    │                                        │ getAvailableSlots()
    │                                        ├──────────────────────>
    │                                        │                       DoctorService
    │                                        │                            │
    │                                        │                            │ findActiveSchedule()
    │                                        │                            ├──────────────────────>
    │                                        │                            │                       SELECT * FROM doctor_schedules
    │                                        │                            │                       WHERE doctor_id=1 AND day='WEDNESDAY'
    │                                        │                            │<──────────────────────
    │                                        │                            │ DoctorSchedule
    │                                        │                            │
    │                                        │                            │ Generate time slots
    │                                        │<──────────────────────
    │                                        │ List<String>
    │<──────────────────────────────────
    │ JSON: ["09:00:00", "09:30:00"...]
    │
showSlotSelectionModal()
```

### Request 3: Create Appointment
```
Frontend                    Backend                     Database
────────                    ───────                     ────────

confirmAppointment()
    │
    │ POST /api/appointments
    │ Body: {doctorId:1, date:"2026-03-12", time:"10:00:00"...}
    ├──────────────────────────────────>
    │                                   AppointmentController
    │                                        │
    │                                        │ bookAppointment()
    │                                        ├──────────────────────>
    │                                        │                       AppointmentService
    │                                        │                            │
    │                                        │                            │ save()
    │                                        │                            ├──────────────────────>
    │                                        │                            │                       INSERT INTO appointments
    │                                        │                            │                       VALUES (...)
    │                                        │                            │<──────────────────────
    │                                        │                            │ Appointment (with ID)
    │                                        │<──────────────────────
    │                                        │ AppointmentDTO
    │<──────────────────────────────────
    │ JSON: {id:12345, status:"CONFIRMED"...}
    │
showAppointmentConfirmation()
```

---

## Color Scheme

```
Primary Color:    #10B981 (Green) - Success, Available
Secondary Color:  #3B82F6 (Blue) - Actions, Links
Accent Color:     #EF4444 (Red) - Emergency, Urgent
Gray:             #6B7280 - Text, Borders
Light:            #F3F4F6 - Backgrounds
Dark:             #1F2937 - Headers, Important Text
```

---

## Responsive Design

### Desktop View (> 1024px)
- Hospital cards: 3 columns
- Time slots: 4 columns
- Full modals with animations

### Tablet View (768px - 1024px)
- Hospital cards: 2 columns
- Time slots: 3 columns
- Adjusted modal sizes

### Mobile View (< 768px)
- Hospital cards: 1 column
- Time slots: 2 columns
- Full-screen modals

---

## Animation Effects

1. **Modal Entry**: Scale from 0.9 to 1.0, fade in
2. **Modal Exit**: Scale to 0.9, fade out
3. **Button Hover**: Scale 1.05, shadow increase
4. **Time Slot Hover**: Background color change, scale 1.02
5. **Loading**: Spinner animation

---

**This visual guide shows the complete user journey through the booking system!** 🎨
