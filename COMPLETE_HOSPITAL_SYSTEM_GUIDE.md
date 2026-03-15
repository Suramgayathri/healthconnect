# 🏥 Complete Hospital-Based Appointment System

## ✅ Implementation Complete

The system now supports database-driven hospital and doctor management with complete appointment booking functionality.

---

## 📊 Database Structure

### Hospitals Table (10 Hospitals)
- Apollo Hospitals (Hyderabad) - 3 doctors
- Fortis Healthcare (Bangalore) - 3 doctors
- Max Healthcare (New Delhi) - 3 doctors
- Manipal Hospitals (Bangalore) - 3 doctors
- KIMS Hospitals (Hyderabad) - 2 doctors
- Narayana Health (Bangalore) - 3 doctors
- Yashoda Hospitals (Hyderabad) - 2 doctors
- Columbia Asia Hospital (Bangalore) - 2 doctors
- Care Hospitals (Hyderabad) - 2 doctors
- Rainbow Children Hospital (Hyderabad) - 2 doctors

### Total: 25 Doctors across 10 Hospitals

---

## 🚀 Quick Setup

### Step 1: Run SQL Script

```bash
mysql -u root -p healthsystem < src/main/resources/complete_hospital_doctor_data.sql
```

Or in MySQL Workbench:
- File → Open SQL Script
- Select: `src/main/resources/complete_hospital_doctor_data.sql`
- Execute (⚡ icon)

### Step 2: Restart Application

The application will automatically detect the new tables and relationships.

---

## 🔌 API Endpoints

### Hospital Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospitals` | Get all active hospitals |
| GET | `/api/hospitals/search?query={text}` | Search hospitals by name/city/address |
| GET | `/api/hospitals/city/{city}` | Get hospitals in a specific city |
| GET | `/api/hospitals/{id}` | Get hospital details by ID |

### Doctor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors?hospitalId={id}` | Get doctors by hospital ID |
| GET | `/api/doctors?hospital={name}` | Get doctors by hospital name |
| GET | `/api/doctors/{id}` | Get doctor details |
| GET | `/api/doctors/{id}/availability` | Get available time slots |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments/patient` | Get patient appointments |
| DELETE | `/api/appointments/{id}` | Cancel appointment |

---

## 📝 Sample API Calls

### Get All Hospitals
```bash
curl -X GET "http://localhost:8080/api/hospitals" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Search Hospitals
```bash
curl -X GET "http://localhost:8080/api/hospitals/search?query=Apollo" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Doctors by Hospital ID
```bash
curl -X GET "http://localhost:8080/api/doctors?hospitalId=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Appointment
```bash
curl -X POST "http://localhost:8080/api/appointments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": 1,
    "locationId": 1,
    "appointmentDate": "2026-03-15",
    "appointmentTime": "10:00:00",
    "consultationType": "IN_PERSON",
    "reasonForVisit": "General Consultation",
    "isEmergency": false,
    "urgencyLevel": "LOW"
  }'
```

---

## 🎯 Complete Booking Flow

```
1. Patient Dashboard
   └─ Click "Find Hospitals"

2. Hospital List Page
   └─ Shows all hospitals from database
   └─ Search/filter by name or city

3. Select Hospital
   └─ Click "Book Appointment"

4. Doctor Selection
   └─ API: GET /api/doctors?hospitalId={id}
   └─ Shows doctors at that hospital

5. View Available Slots
   └─ API: GET /api/doctors/{id}/availability
   └─ Shows time slots

6. Select Time Slot
   └─ API: POST /api/appointments
   └─ Creates appointment

7. Confirmation
   └─ Shows appointment details
```

---

## 🗄️ Database Schema

### hospitals table
```sql
CREATE TABLE hospitals (
    hospital_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hospital_name VARCHAR(200) NOT NULL,
    hospital_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    pincode VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    total_beds INT,
    emergency_services BOOLEAN DEFAULT false,
    ambulance_services BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    facilities TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### doctors table (updated)
```sql
ALTER TABLE doctors 
ADD COLUMN hospital_id BIGINT,
ADD CONSTRAINT fk_doctor_hospital 
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id);
```

---

## 🧪 Testing

### Verify Data Insertion

```sql
-- Check hospitals
SELECT hospital_id, hospital_name, city, phone 
FROM hospitals;

-- Check doctors with hospitals
SELECT 
    d.doctor_id,
    d.full_name,
    d.specialization,
    h.hospital_name,
    h.city
FROM doctors d
JOIN hospitals h ON d.hospital_id = h.hospital_id
ORDER BY h.hospital_name;

-- Count doctors per hospital
SELECT 
    h.hospital_name,
    COUNT(d.doctor_id) as doctor_count
FROM hospitals h
LEFT JOIN doctors d ON h.hospital_id = d.hospital_id
GROUP BY h.hospital_id, h.hospital_name;
```

---

## 📦 Files Created/Modified

### Backend (7 files)
1. ✅ `Hospital.java` - Hospital entity
2. ✅ `HospitalRepository.java` - Hospital data access
3. ✅ `HospitalDTO.java` - Hospital data transfer object
4. ✅ `HospitalService.java` - Hospital business logic
5. ✅ `HospitalController.java` - Hospital REST API
6. ✅ `Doctor.java` - Added hospital_id field
7. ✅ `DoctorService.java` - Added getDoctorsByHospitalId method

### Database (1 file)
8. ✅ `complete_hospital_doctor_data.sql` - Complete data script

### Documentation (1 file)
9. ✅ `COMPLETE_HOSPITAL_SYSTEM_GUIDE.md` - This file

---

## 🔐 Doctor Login Credentials

All sample doctors can login with:
- **Password:** `Doctor@123`
- **Email:** See the SQL script for complete list

Example:
- dr.ramesh.kumar@apollo.com
- dr.amit.gupta@fortis.com
- dr.anjali.desai@maxhealth.com

---

## ✅ Features Implemented

### Hospital Management
- ✅ Database-driven hospital storage
- ✅ Search hospitals by name/city/address
- ✅ Filter hospitals by city
- ✅ Hospital details with doctor count
- ✅ Active/inactive hospital status

### Doctor Management
- ✅ Doctors linked to hospitals via hospital_id
- ✅ Query doctors by hospital ID
- ✅ Query doctors by hospital name (backward compatible)
- ✅ Doctor availability and verification status
- ✅ Consultation fees and ratings

### Appointment Booking
- ✅ Complete booking flow
- ✅ Time slot selection
- ✅ Appointment creation
- ✅ Appointment management

---

## 🎊 Next Steps

1. ✅ Run the SQL script
2. ✅ Restart the application
3. ✅ Test the API endpoints
4. 🔄 Update frontend to use new hospital endpoints
5. 🔄 Test complete booking flow

---

**Status:** Backend Complete ✅  
**Total Hospitals:** 10  
**Total Doctors:** 25  
**Ready for Frontend Integration:** YES
