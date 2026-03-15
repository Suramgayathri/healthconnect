# Complete Booking Flow - Testing Guide 🧪

## Status: ✅ READY TO TEST

The complete hospital → doctor → slots → appointment booking flow has been implemented and is ready for testing!

## Quick Start

### 1. Setup Database (IMPORTANT - Do this first!)

Run this SQL to assign doctors to hospitals:

```sql
-- Add hospital columns (if not already added)
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS hospital_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS hospital_address TEXT;

-- Assign doctors to hospitals (adjust doctor_id values based on your data)
UPDATE doctors 
SET hospital_name = 'Apollo Hospitals',
    hospital_address = 'Main Road, City Center'
WHERE doctor_id IN (1, 2);

UPDATE doctors 
SET hospital_name = 'City General Hospital',
    hospital_address = '123 Main Street, Downtown'
WHERE doctor_id IN (3, 4);

UPDATE doctors 
SET hospital_name = 'Fortis Healthcare',
    hospital_address = '456 Health Avenue, Medical District'
WHERE doctor_id IN (5, 6);

-- Verify the updates
SELECT doctor_id, full_name, specialization, hospital_name, is_available, is_verified
FROM doctors
ORDER BY hospital_name, full_name;
```

### 2. Start Application

```bash
./mvnw spring-boot:run
```

Wait for: `Started AppointmentSystemApplication`

### 3. Login as Patient

1. Go to: http://localhost:8080/login.html
2. Login with patient credentials
3. Navigate to Patient Dashboard

## Testing the Complete Flow

### Test Case 1: Successful Booking ✅

**Steps:**
1. Click "Find Hospitals" from patient dashboard
2. Click "Use My Location" (or enter a location)
3. Wait for nearby hospitals to load
4. Click "Book Appointment" on any hospital
5. **Expected:** Modal shows doctors at that hospital
6. Click "View Available Slots" for a doctor
7. **Expected:** Modal shows time slots for tomorrow
8. Click any time slot
9. **Expected:** Appointment created, confirmation screen appears
10. **Expected:** Shows appointment ID, doctor name, date, time

**Success Criteria:**
- ✅ Doctors filtered by hospital name
- ✅ Time slots displayed in 12-hour format
- ✅ Appointment saved to database
- ✅ Confirmation screen with all details

### Test Case 2: No Doctors at Hospital ⚠️

**Steps:**
1. Find a hospital with no assigned doctors
2. Click "Book Appointment"
3. **Expected:** "No Doctors Found" message
4. **Expected:** Option to "View All Doctors"
5. Click "View All Doctors"
6. **Expected:** Shows all available doctors (not filtered by hospital)

**Success Criteria:**
- ✅ Graceful error handling
- ✅ Fallback to all doctors
- ✅ User can still book

### Test Case 3: Doctor with No Slots 📅

**Steps:**
1. Select a doctor with no schedule configured
2. Click "View Available Slots"
3. **Expected:** Either shows default slots OR "No Slots Available" message
4. If no slots, click "Back to Doctors"
5. **Expected:** Returns to doctor selection

**Success Criteria:**
- ✅ Handles missing schedules
- ✅ Shows default slots as fallback
- ✅ Clear messaging

### Test Case 4: Not Logged In 🔒

**Steps:**
1. Logout from application
2. Try to access: http://localhost:8080/hospital_search.html
3. **Expected:** Redirects to login page

**Success Criteria:**
- ✅ Authentication check works
- ✅ Redirects to login

## API Testing

### Test API Endpoints Directly

#### 1. Get Doctors by Hospital
```bash
curl -X GET "http://localhost:8080/api/doctors?hospital=Apollo" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "fullName": "Dr. Ramesh Kumar",
    "specialization": "Cardiologist",
    "experienceYears": 10,
    "consultationFee": 500,
    "hospitalName": "Apollo Hospitals",
    "isAvailable": true,
    "isVerified": true
  }
]
```

#### 2. Get Available Slots
```bash
curl -X GET "http://localhost:8080/api/doctors/1/availability?locationId=1&date=2026-03-12" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
[
  "09:00:00",
  "09:30:00",
  "10:00:00",
  "10:30:00",
  "11:00:00"
]
```

#### 3. Create Appointment
```bash
curl -X POST "http://localhost:8080/api/appointments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": 1,
    "locationId": 1,
    "appointmentDate": "2026-03-12",
    "appointmentTime": "10:00:00",
    "consultationType": "IN_PERSON",
    "reasonForVisit": "General Consultation",
    "isEmergency": false,
    "urgencyLevel": "LOW"
  }'
```

**Expected Response:**
```json
{
  "id": 123,
  "doctorName": "Dr. Ramesh Kumar",
  "appointmentDate": "2026-03-12",
  "appointmentTime": "10:00:00",
  "status": "CONFIRMED"
}
```

## Verification Checklist

### Backend ✅
- [x] Doctor entity has `hospital_name` and `hospital_address` fields
- [x] DoctorRepository has hospital filter method
- [x] DoctorService has `getDoctorsByHospital()` method
- [x] DoctorController has `GET /api/doctors?hospital=` endpoint
- [x] No compilation errors
- [x] No diagnostics issues

### Frontend ✅
- [x] hospital_search.js has `bookAppointment()` function
- [x] hospital_search.js has `viewAvailableSlots()` function
- [x] hospital_search.js has `showSlotSelectionModal()` function
- [x] hospital_search.js has `confirmAppointment()` function
- [x] hospital_search.js has `showAppointmentConfirmation()` function
- [x] CSS has time-slots-grid styles
- [x] All modals have close functionality

### Database ✅
- [ ] **TODO:** Run SQL to add hospital columns
- [ ] **TODO:** Run SQL to assign doctors to hospitals
- [ ] **TODO:** Verify doctors have hospital_name populated

### Integration ✅
- [ ] **TODO:** Test complete flow end-to-end
- [ ] **TODO:** Verify appointment created in database
- [ ] **TODO:** Test edge cases (no doctors, no slots)
- [ ] **TODO:** Test on mobile device

## Common Issues & Solutions

### Issue 1: "No doctors currently available"
**Cause:** Doctors not assigned to hospitals in database
**Solution:** Run the SQL UPDATE statements above

### Issue 2: "Failed to load doctors"
**Cause:** Backend not running or authentication issue
**Solution:** 
- Check if Spring Boot is running
- Verify token in localStorage
- Check browser console for errors

### Issue 3: No time slots showing
**Cause:** Doctor has no schedule configured
**Solution:** 
- System will show default slots as fallback
- Or configure doctor schedules in admin panel

### Issue 4: Appointment not created
**Cause:** Missing patient ID or invalid data
**Solution:**
- Check localStorage has userId
- Verify patient is logged in
- Check backend logs for errors

## Database Verification

### Check Doctors with Hospitals
```sql
SELECT 
    doctor_id,
    full_name,
    specialization,
    hospital_name,
    hospital_address,
    is_available,
    is_verified
FROM doctors
WHERE hospital_name IS NOT NULL
ORDER BY hospital_name;
```

### Check Created Appointments
```sql
SELECT 
    a.appointment_id,
    p.full_name AS patient_name,
    d.full_name AS doctor_name,
    d.hospital_name,
    a.appointment_date,
    a.appointment_time,
    a.status
FROM appointments a
JOIN patients p ON a.patient_id = p.patient_id
JOIN doctors d ON a.doctor_id = d.doctor_id
ORDER BY a.created_at DESC
LIMIT 10;
```

## Browser Console Debugging

Open browser console (F12) and check for:

### Successful Flow
```
Fetching doctors for hospital: Apollo Hospitals
Doctor list loaded: 2 doctors
Fetching slots for doctor 1
Slots loaded: 8 slots
Creating appointment...
Appointment created: ID 123
```

### Error Flow
```
Error fetching doctors: 403 Forbidden
→ Check authentication token

Error booking appointment: 400 Bad Request
→ Check request payload

Failed to load hospitals
→ Check OpenStreetMap API connection
```

## Performance Metrics

Expected response times:
- Hospital search: < 2 seconds
- Doctor list: < 500ms
- Available slots: < 300ms
- Create appointment: < 500ms

## Next Steps After Testing

1. ✅ Verify all test cases pass
2. ✅ Check database has appointments
3. ✅ Test on different browsers
4. ✅ Test on mobile devices
5. ✅ Review user experience
6. 🎉 Deploy to production!

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Spring Boot logs
3. Verify database has correct data
4. Test API endpoints directly with curl
5. Review this guide for solutions

---

**The complete booking flow is implemented and ready!** 🚀

Just run the SQL setup and start testing! 🧪
