# 📊 Sample Doctors Data - Quick Guide

## Overview

This guide explains the sample doctor data inserted into your system for testing the hospital-based appointment booking feature.

---

## 🏥 Hospital Distribution

### Apollo Hospitals (Hyderabad)
**Address:** Jubilee Hills, Road No. 72, Hyderabad, Telangana 500033

| Doctor | Specialization | Experience | Fee | Rating |
|--------|---------------|------------|-----|--------|
| Dr. Ramesh Kumar | Cardiologist | 15 years | ₹800 | 4.8⭐ |
| Dr. Priya Sharma | Neurologist | 12 years | ₹700 | 4.7⭐ |
| Dr. Anil Verma | Orthopedic Surgeon | 18 years | ₹900 | 4.9⭐ |

### City General Hospital (Secunderabad)
**Address:** MG Road, Secunderabad, Telangana 500003

| Doctor | Specialization | Experience | Fee | Rating |
|--------|---------------|------------|-----|--------|
| Dr. Sunita Reddy | Pediatrician | 10 years | ₹500 | 4.6⭐ |
| Dr. Rajesh Patel | General Physician | 8 years | ₹400 | 4.5⭐ |
| Dr. Kavita Singh | Dermatologist | 9 years | ₹600 | 4.7⭐ |

### Fortis Healthcare (Bangalore)
**Address:** Bannerghatta Road, Bangalore, Karnataka 560076

| Doctor | Specialization | Experience | Fee | Rating |
|--------|---------------|------------|-----|--------|
| Dr. Amit Gupta | Gastroenterologist | 14 years | ₹750 | 4.8⭐ |
| Dr. Neha Joshi | Gynecologist | 11 years | ₹650 | 4.9⭐ |
| Dr. Vikram Mehta | Pulmonologist | 13 years | ₹700 | 4.7⭐ |

### Max Healthcare (New Delhi)
**Address:** Saket, Press Enclave Road, New Delhi 110017

| Doctor | Specialization | Experience | Fee | Rating |
|--------|---------------|------------|-----|--------|
| Dr. Anjali Desai | Endocrinologist | 10 years | ₹650 | 4.8⭐ |
| Dr. Suresh Kumar | Urologist | 16 years | ₹800 | 4.9⭐ |
| Dr. Pooja Nair | Psychiatrist | 9 years | ₹600 | 4.7⭐ |

---

## 🚀 How to Insert Sample Data

### Step 1: Run the SQL Script

```bash
# Option 1: Using MySQL command line
mysql -u root -p healthsystem < src/main/resources/sample_doctors_data.sql

# Option 2: Using MySQL Workbench
# - Open MySQL Workbench
# - Connect to your database
# - File → Open SQL Script
# - Select: src/main/resources/sample_doctors_data.sql
# - Execute (⚡ icon or Ctrl+Shift+Enter)
```

### Step 2: Verify Data Insertion

```sql
-- Check all doctors with hospitals
SELECT 
    doctor_id,
    full_name,
    specialization,
    hospital_name,
    consultation_fee,
    is_available,
    is_verified
FROM doctors
ORDER BY hospital_name, full_name;

-- Count doctors per hospital
SELECT 
    hospital_name,
    COUNT(*) as doctor_count
FROM doctors
WHERE hospital_name IS NOT NULL
GROUP BY hospital_name;
```

**Expected Result:**
- Apollo Hospitals: 3 doctors
- City General Hospital: 3 doctors
- Fortis Healthcare: 3 doctors
- Max Healthcare: 3 doctors
- **Total: 12 doctors**

---

## 🧪 Testing the Booking Flow

### Test Scenario 1: Apollo Hospitals

1. Go to hospital search page
2. Search for "Apollo" or find Apollo Hospitals nearby
3. Click "Book Appointment"
4. **Expected:** See 3 doctors:
   - Dr. Ramesh Kumar (Cardiologist)
   - Dr. Priya Sharma (Neurologist)
   - Dr. Anil Verma (Orthopedic Surgeon)

### Test Scenario 2: City General Hospital

1. Search for "City General"
2. Click "Book Appointment"
3. **Expected:** See 3 doctors:
   - Dr. Sunita Reddy (Pediatrician)
   - Dr. Rajesh Patel (General Physician)
   - Dr. Kavita Singh (Dermatologist)

### Test Scenario 3: Fortis Healthcare

1. Search for "Fortis"
2. Click "Book Appointment"
3. **Expected:** See 3 doctors:
   - Dr. Amit Gupta (Gastroenterologist)
   - Dr. Neha Joshi (Gynecologist)
   - Dr. Vikram Mehta (Pulmonologist)

### Test Scenario 4: Max Healthcare

1. Search for "Max"
2. Click "Book Appointment"
3. **Expected:** See 3 doctors:
   - Dr. Anjali Desai (Endocrinologist)
   - Dr. Suresh Kumar (Urologist)
   - Dr. Pooja Nair (Psychiatrist)

---

## 🔐 Doctor Login Credentials

All sample doctors can login with:
- **Email:** As shown in the table below
- **Password:** `Doctor@123`

| Doctor | Email |
|--------|-------|
| Dr. Ramesh Kumar | dr.ramesh.kumar@apollo.com |
| Dr. Priya Sharma | dr.priya.sharma@apollo.com |
| Dr. Anil Verma | dr.anil.verma@apollo.com |
| Dr. Sunita Reddy | dr.sunita.reddy@citygen.com |
| Dr. Rajesh Patel | dr.rajesh.patel@citygen.com |
| Dr. Kavita Singh | dr.kavita.singh@citygen.com |
| Dr. Amit Gupta | dr.amit.gupta@fortis.com |
| Dr. Neha Joshi | dr.neha.joshi@fortis.com |
| Dr. Vikram Mehta | dr.vikram.mehta@fortis.com |
| Dr. Anjali Desai | dr.anjali.desai@maxhealth.com |
| Dr. Suresh Kumar | dr.suresh.kumar@maxhealth.com |
| Dr. Pooja Nair | dr.pooja.nair@maxhealth.com |

---

## 📋 Data Characteristics

### All Doctors Have:
- ✅ **Available:** is_available = true
- ✅ **Verified:** is_verified = true
- ✅ **Realistic Ratings:** 4.5 - 4.9 stars
- ✅ **Review Counts:** 87 - 203 reviews
- ✅ **Experience:** 8 - 18 years
- ✅ **Consultation Fees:** ₹400 - ₹900
- ✅ **Multiple Languages:** English + regional languages
- ✅ **Detailed Qualifications:** MBBS + specialization degrees
- ✅ **Professional About:** Detailed description of expertise

---

## 🔍 API Testing

### Get Doctors by Hospital

```bash
# Apollo Hospitals
curl -X GET "http://localhost:8080/api/doctors?hospital=Apollo" \
  -H "Authorization: Bearer YOUR_TOKEN"

# City General Hospital
curl -X GET "http://localhost:8080/api/doctors?hospital=City%20General" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Fortis Healthcare
curl -X GET "http://localhost:8080/api/doctors?hospital=Fortis" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Max Healthcare
curl -X GET "http://localhost:8080/api/doctors?hospital=Max" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🗑️ Cleanup (If Needed)

If you need to remove the sample data:

```sql
-- Delete sample doctors
DELETE FROM doctors 
WHERE hospital_name IN (
    'Apollo Hospitals',
    'City General Hospital',
    'Fortis Healthcare',
    'Max Healthcare'
);

-- Delete sample doctor users
DELETE FROM users 
WHERE email LIKE '%@apollo.com'
   OR email LIKE '%@citygen.com'
   OR email LIKE '%@fortis.com'
   OR email LIKE '%@maxhealth.com';
```

---

## 📊 Database Schema Reference

### Doctors Table Structure
```sql
CREATE TABLE doctors (
    doctor_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    full_name VARCHAR(100),
    specialization VARCHAR(100),
    qualifications TEXT,
    license_number VARCHAR(100),
    experience_years INT,
    about TEXT,
    languages_spoken VARCHAR(255),
    consultation_fee DECIMAL(10,2),
    hospital_name VARCHAR(255),        -- NEW: Hospital assignment
    hospital_address TEXT,              -- NEW: Hospital address
    average_rating DECIMAL(3,2),
    total_reviews INT,
    is_available BOOLEAN,
    is_verified BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## ✅ Verification Checklist

After inserting data:
- [ ] 12 doctors inserted successfully
- [ ] Each hospital has 3 doctors
- [ ] All doctors are available and verified
- [ ] All doctors have hospital_name populated
- [ ] All doctors have consultation fees
- [ ] All doctors have ratings and reviews
- [ ] Can query doctors by hospital name
- [ ] Booking flow shows correct doctors

---

## 🎯 Expected Behavior

### When User Searches for Hospital

1. **User finds "Apollo Hospitals"**
2. **Clicks "Book Appointment"**
3. **System calls:** `GET /api/doctors?hospital=Apollo`
4. **Backend filters:** Doctors where hospital_name LIKE '%Apollo%'
5. **Returns:** 3 doctors (Ramesh, Priya, Anil)
6. **Frontend displays:** Doctor cards with details
7. **User selects doctor:** Views available slots
8. **User books:** Appointment created!

---

## 🔧 Troubleshooting

### Issue: No doctors showing for hospital
**Check:**
```sql
SELECT * FROM doctors WHERE hospital_name LIKE '%Apollo%';
```
**Fix:** Run the sample_doctors_data.sql script

### Issue: Duplicate key error
**Cause:** Doctors already exist
**Fix:** Either skip duplicates (script handles this) or delete existing data first

### Issue: User not found error
**Cause:** User accounts not created
**Fix:** Script creates users first, then doctors

---

## 📚 Related Files

- **sample_doctors_data.sql** - Main SQL script
- **add_hospital_doctors.sql** - Original hospital assignment script
- **START_HERE.md** - Quick start guide
- **BOOKING_FLOW_TEST_GUIDE.md** - Testing guide

---

## 🎉 Ready to Test!

After running the SQL script:
1. ✅ 12 doctors inserted
2. ✅ 4 hospitals covered
3. ✅ All doctors available and verified
4. ✅ Ready for appointment booking

**Next Step:** Test the complete booking flow!

---

**File Location:** `src/main/resources/sample_doctors_data.sql`  
**Total Doctors:** 12  
**Total Hospitals:** 4  
**Status:** ✅ Ready to use
