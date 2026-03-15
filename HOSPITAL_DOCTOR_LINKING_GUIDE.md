# Hospital-Doctor Linking Implementation ✅

## What Was Implemented

Now doctors are properly linked to hospitals! When you click "Book Appointment" on a hospital, you'll see ONLY the doctors working at that specific hospital.

## Changes Made

### 1. Database Schema Updated

**Added to Doctor table:**
```sql
ALTER TABLE doctors 
ADD COLUMN hospital_name VARCHAR(255),
ADD COLUMN hospital_address TEXT;
```

### 2. Backend Updated

**Doctor.java** - Added fields:
- `hospitalName` - Name of the hospital
- `hospitalAddress` - Hospital address

**DoctorSearchDTO.java** - Added filter:
- `hospitalName` - Filter doctors by hospital

**DoctorRepository.java** - Updated query:
```java
@Query("SELECT d FROM Doctor d WHERE " +
    "(:hospitalName IS NULL OR LOWER(d.hospitalName) LIKE LOWER(CONCAT('%', :hospitalName, '%')))")
```

**DoctorService.java** - Updated search to use hospital filter

### 3. Frontend Updated

**hospital_search.js** - Now filters by hospital:
```javascript
fetch(`/api/doctors/search?hospitalName=${hospitalName}`)
```

## How It Works Now

### Step 1: User Searches Hospitals
```
User location: New York
↓
Shows: City General Hospital, Apollo Hospital, etc.
```

### Step 2: User Clicks "Book Appointment"
```
Hospital: City General Hospital
↓
API call: /api/doctors/search?hospitalName=City General Hospital
↓
Returns: Only doctors at City General Hospital
```

### Step 3: Modal Shows Hospital-Specific Doctors
```
┌────────────────────────────────┐
│ Select a Doctor                │
│ 📍 Booking for City General    │
├────────────────────────────────┤
│ Dr. Sarah Smith - Cardiologist │  ← Works at City General
│ Dr. John Doe - Neurologist     │  ← Works at City General
└────────────────────────────────┘
```

### Step 4: No Doctors? Fallback Option
```
┌────────────────────────────────┐
│ No Doctors Found           ✕  │
├────────────────────────────────┤
│ No doctors at Apollo Hospital  │
│                                │
│ View all available doctors?    │
│                                │
│ [Cancel] [View All Doctors]    │
└────────────────────────────────┘
```

## Setup Instructions

### Option 1: Automatic (Hibernate will create columns)

Just restart your application:
```bash
./mvnw spring-boot:run
```

Hibernate will automatically add the new columns to the `doctors` table.

### Option 2: Manual SQL (Recommended)

Run the SQL script:
```bash
# Connect to MySQL
mysql -u root -p healthsystem

# Run the script
source src/main/resources/add_hospital_doctors.sql
```

Or execute directly:
```sql
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS hospital_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS hospital_address TEXT;
```

## Assigning Doctors to Hospitals

### Method 1: Via SQL

```sql
-- Assign Dr. Sarah Smith to City General Hospital
UPDATE doctors 
SET hospital_name = 'City General Hospital',
    hospital_address = '123 Main Street, Downtown'
WHERE full_name = 'Sarah Smith';

-- Assign multiple doctors at once
UPDATE doctors 
SET hospital_name = 'Apollo Medical Center',
    hospital_address = '456 Health Avenue'
WHERE doctor_id IN (4, 5, 6);
```

### Method 2: Via Admin Panel (Future)

You can create an admin interface to assign doctors to hospitals.

### Method 3: During Doctor Registration

Update `register_doctor.html` to include hospital selection:
```html
<select name="hospital">
    <option value="City General Hospital">City General Hospital</option>
    <option value="Apollo Medical Center">Apollo Medical Center</option>
</select>
```

## Testing

### Test 1: Doctor at Specific Hospital
```sql
-- Add a test doctor
UPDATE doctors 
SET hospital_name = 'City General Hospital'
WHERE doctor_id = 1;
```

Then:
1. Search for "City General Hospital"
2. Click "Book Appointment"
3. Should see that doctor!

### Test 2: No Doctors at Hospital
1. Search for any hospital
2. Click "Book Appointment" on hospital with no doctors
3. Should see "No Doctors Found" modal
4. Click "View All Doctors" to see all available doctors

### Test 3: Multiple Doctors at Hospital
```sql
-- Add multiple doctors to same hospital
UPDATE doctors 
SET hospital_name = 'Apollo Medical Center'
WHERE doctor_id IN (2, 3, 4);
```

Then:
1. Search for "Apollo Medical Center"
2. Click "Book Appointment"
3. Should see all 3 doctors!

## Sample Data Script

```sql
-- Assign doctors to hospitals (adjust doctor_ids as needed)

-- City General Hospital
UPDATE doctors 
SET hospital_name = 'City General Hospital',
    hospital_address = '123 Main Street, Downtown'
WHERE specialization = 'Cardiologist';

-- Apollo Medical Center  
UPDATE doctors 
SET hospital_name = 'Apollo Medical Center',
    hospital_address = '456 Health Avenue, Medical District'
WHERE specialization = 'Neurologist';

-- St. Mary's Hospital
UPDATE doctors 
SET hospital_name = 'St. Mary''s Hospital',
    hospital_address = '789 Care Road, Westside'
WHERE specialization = 'Pediatrician';

-- Metro Emergency Hospital
UPDATE doctors 
SET hospital_name = 'Metro Emergency Hospital',
    hospital_address = '555 Urgent Lane, Central'
WHERE specialization = 'Emergency Medicine';

-- Children's Care Hospital
UPDATE doctors 
SET hospital_name = 'Children''s Care Hospital',
    hospital_address = '888 Kids Avenue, Northside'
WHERE specialization IN ('Pediatrician', 'Neonatologist');
```

## API Usage

### Search Doctors by Hospital
```bash
GET /api/doctors/search?hospitalName=City%20General%20Hospital
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "fullName": "Sarah Smith",
      "specialization": "Cardiologist",
      "hospitalName": "City General Hospital",
      "hospitalAddress": "123 Main Street",
      "consultationFee": 500,
      "isAvailable": true
    }
  ]
}
```

### Search All Doctors (No Filter)
```bash
GET /api/doctors/search?page=0&size=20
```

## User Experience Flow

```
1. User searches for hospitals near them
   ↓
2. Sees list of hospitals with photos
   ↓
3. Clicks "Book Appointment" on City General Hospital
   ↓
4. System queries: doctors WHERE hospital = "City General Hospital"
   ↓
5. Modal shows ONLY doctors at City General Hospital
   ↓
6. User selects Dr. Sarah Smith
   ↓
7. Proceeds to booking with doctor pre-selected
```

## Benefits

✅ **Accurate** - Shows only doctors at selected hospital
✅ **User-friendly** - Clear which doctors work where
✅ **Flexible** - Fallback to all doctors if none at hospital
✅ **Scalable** - Easy to add more hospitals and doctors
✅ **Searchable** - Partial name matching (e.g., "Apollo" matches "Apollo Medical Center")

## Future Enhancements

1. **Multiple Hospitals per Doctor**
   - Doctor can work at multiple locations
   - Show all locations for each doctor

2. **Hospital Entity**
   - Create separate Hospital table
   - Foreign key relationship

3. **Admin Interface**
   - Assign/unassign doctors to hospitals
   - Manage hospital information

4. **Doctor Schedules per Hospital**
   - Different schedules at different hospitals
   - Availability varies by location

## Files Modified

1. `Doctor.java` - Added hospital fields
2. `DoctorSearchDTO.java` - Added hospital filter
3. `DoctorRepository.java` - Updated search query
4. `DoctorService.java` - Pass hospital parameter
5. `hospital_search.js` - Filter by hospital name
6. `add_hospital_doctors.sql` - Setup script

## Quick Start

```bash
# 1. Restart application (creates columns)
./mvnw spring-boot:run

# 2. Assign doctors to hospitals (in MySQL)
UPDATE doctors 
SET hospital_name = 'City General Hospital'
WHERE doctor_id = 1;

# 3. Test it!
# - Search for hospitals
# - Click "Book Appointment"
# - See doctors at that hospital!
```

**Now doctors are properly linked to hospitals!** 🏥👨‍⚕️
