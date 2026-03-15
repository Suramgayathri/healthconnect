-- ============================================================================
-- SAMPLE DOCTORS DATA WITH HOSPITAL ASSIGNMENTS
-- ============================================================================
-- This script inserts sample doctor records linked to hospitals
-- for testing the hospital-based appointment booking system
-- ============================================================================

-- First, let's create some user accounts for doctors (if they don't exist)
-- Password for all sample doctors: "Doctor@123" (BCrypt encoded)

-- Insert Users for Doctors
INSERT INTO users (email, password, role, is_active, created_at, updated_at)
VALUES 
    ('dr.ramesh.kumar@apollo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
    ('dr.priya.sharma@apollo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
    ('dr.anil.verma@apollo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
    ('dr.sunita.reddy@citygen.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
    ('dr.rajesh.patel@citygen.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
    ('dr.kavita.singh@citygen.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
    ('dr.amit.gupta@fortis.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
    ('dr.neha.joshi@fortis.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
    ('dr.vikram.mehta@fortis.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
    ('dr.anjali.desai@maxhealth.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
    ('dr.suresh.kumar@maxhealth.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
    ('dr.pooja.nair@maxhealth.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE email = email;

-- Insert Doctor Profiles linked to hospitals

-- APOLLO HOSPITALS - 3 Doctors
INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Ramesh Kumar',
    'Cardiologist',
    'MBBS, MD (Cardiology), DM (Cardiology)',
    'MCI-12345-CARD',
    15,
    'Experienced cardiologist specializing in interventional cardiology and heart failure management. Performed over 2000+ successful cardiac procedures.',
    'English, Hindi, Telugu',
    800.00,
    'Apollo Hospitals',
    'Jubilee Hills, Road No. 72, Hyderabad, Telangana 500033',
    4.8,
    156,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.ramesh.kumar@apollo.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Priya Sharma',
    'Neurologist',
    'MBBS, MD (Medicine), DM (Neurology)',
    'MCI-23456-NEURO',
    12,
    'Specialist in treating neurological disorders including epilepsy, stroke, and movement disorders. Expert in neuromuscular diseases.',
    'English, Hindi, Punjabi',
    700.00,
    'Apollo Hospitals',
    'Jubilee Hills, Road No. 72, Hyderabad, Telangana 500033',
    4.7,
    142,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.priya.sharma@apollo.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Anil Verma',
    'Orthopedic Surgeon',
    'MBBS, MS (Orthopedics), MCh (Orthopedics)',
    'MCI-34567-ORTHO',
    18,
    'Senior orthopedic surgeon with expertise in joint replacement, sports injuries, and spine surgery. Performed 3000+ successful surgeries.',
    'English, Hindi, Marathi',
    900.00,
    'Apollo Hospitals',
    'Jubilee Hills, Road No. 72, Hyderabad, Telangana 500033',
    4.9,
    203,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.anil.verma@apollo.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

-- CITY GENERAL HOSPITAL - 3 Doctors
INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Sunita Reddy',
    'Pediatrician',
    'MBBS, MD (Pediatrics), Fellowship in Neonatology',
    'MCI-45678-PEDIA',
    10,
    'Dedicated pediatrician with special interest in child development, vaccination, and neonatal care. Caring approach with children.',
    'English, Hindi, Tamil, Telugu',
    500.00,
    'City General Hospital',
    'MG Road, Secunderabad, Telangana 500003',
    4.6,
    98,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.sunita.reddy@citygen.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Rajesh Patel',
    'General Physician',
    'MBBS, MD (General Medicine)',
    'MCI-56789-GENMED',
    8,
    'Experienced general physician treating common ailments, chronic diseases, and preventive healthcare. Patient-friendly approach.',
    'English, Hindi, Gujarati',
    400.00,
    'City General Hospital',
    'MG Road, Secunderabad, Telangana 500003',
    4.5,
    87,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.rajesh.patel@citygen.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Kavita Singh',
    'Dermatologist',
    'MBBS, MD (Dermatology), Fellowship in Cosmetic Dermatology',
    'MCI-67890-DERM',
    9,
    'Specialist in treating skin, hair, and nail disorders. Expert in cosmetic procedures, acne treatment, and anti-aging treatments.',
    'English, Hindi, Bengali',
    600.00,
    'City General Hospital',
    'MG Road, Secunderabad, Telangana 500003',
    4.7,
    112,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.kavita.singh@citygen.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

-- FORTIS HEALTHCARE - 3 Doctors
INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Amit Gupta',
    'Gastroenterologist',
    'MBBS, MD (Medicine), DM (Gastroenterology)',
    'MCI-78901-GASTRO',
    14,
    'Expert in digestive system disorders, liver diseases, and endoscopic procedures. Specialized in IBD and hepatology.',
    'English, Hindi, Punjabi',
    750.00,
    'Fortis Healthcare',
    'Bannerghatta Road, Bangalore, Karnataka 560076',
    4.8,
    134,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.amit.gupta@fortis.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Neha Joshi',
    'Gynecologist',
    'MBBS, MS (Obstetrics & Gynecology)',
    'MCI-89012-OBGYN',
    11,
    'Experienced gynecologist specializing in high-risk pregnancies, infertility treatment, and minimally invasive gynecological surgeries.',
    'English, Hindi, Marathi, Kannada',
    650.00,
    'Fortis Healthcare',
    'Bannerghatta Road, Bangalore, Karnataka 560076',
    4.9,
    178,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.neha.joshi@fortis.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Vikram Mehta',
    'Pulmonologist',
    'MBBS, MD (Respiratory Medicine), Fellowship in Critical Care',
    'MCI-90123-PULMO',
    13,
    'Specialist in respiratory diseases including asthma, COPD, and lung infections. Expert in critical care and ventilator management.',
    'English, Hindi, Gujarati',
    700.00,
    'Fortis Healthcare',
    'Bannerghatta Road, Bangalore, Karnataka 560076',
    4.7,
    121,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.vikram.mehta@fortis.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

-- MAX HEALTHCARE - 3 Doctors
INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Anjali Desai',
    'Endocrinologist',
    'MBBS, MD (Medicine), DM (Endocrinology)',
    'MCI-01234-ENDO',
    10,
    'Expert in diabetes management, thyroid disorders, and hormonal imbalances. Holistic approach to metabolic diseases.',
    'English, Hindi, Gujarati, Marathi',
    650.00,
    'Max Healthcare',
    'Saket, Press Enclave Road, New Delhi 110017',
    4.8,
    145,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.anjali.desai@maxhealth.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Suresh Kumar',
    'Urologist',
    'MBBS, MS (General Surgery), MCh (Urology)',
    'MCI-12340-URO',
    16,
    'Senior urologist with expertise in kidney stone management, prostate diseases, and minimally invasive urological surgeries.',
    'English, Hindi, Tamil',
    800.00,
    'Max Healthcare',
    'Saket, Press Enclave Road, New Delhi 110017',
    4.9,
    189,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.suresh.kumar@maxhealth.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

INSERT INTO doctors (
    user_id, 
    full_name, 
    specialization, 
    qualifications, 
    license_number, 
    experience_years, 
    about, 
    languages_spoken, 
    consultation_fee, 
    hospital_name, 
    hospital_address,
    average_rating, 
    total_reviews, 
    is_available, 
    is_verified, 
    created_at, 
    updated_at
)
SELECT 
    u.user_id,
    'Pooja Nair',
    'Psychiatrist',
    'MBBS, MD (Psychiatry), Fellowship in Child Psychiatry',
    'MCI-23401-PSYCH',
    9,
    'Compassionate psychiatrist specializing in anxiety, depression, and child behavioral disorders. Evidence-based treatment approach.',
    'English, Hindi, Malayalam',
    600.00,
    'Max Healthcare',
    'Saket, Press Enclave Road, New Delhi 110017',
    4.7,
    102,
    true,
    true,
    NOW(),
    NOW()
FROM users u WHERE u.email = 'dr.pooja.nair@maxhealth.com'
ON DUPLICATE KEY UPDATE full_name = full_name;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all inserted doctors with their hospitals
SELECT 
    d.doctor_id,
    d.full_name,
    d.specialization,
    d.hospital_name,
    d.consultation_fee,
    d.experience_years,
    d.average_rating,
    d.is_available,
    d.is_verified
FROM doctors d
ORDER BY d.hospital_name, d.full_name;

-- Count doctors per hospital
SELECT 
    hospital_name,
    COUNT(*) as doctor_count
FROM doctors
WHERE hospital_name IS NOT NULL
GROUP BY hospital_name
ORDER BY hospital_name;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Total Doctors Inserted: 12
-- 
-- Hospital Distribution:
-- - Apollo Hospitals: 3 doctors (Cardiologist, Neurologist, Orthopedic Surgeon)
-- - City General Hospital: 3 doctors (Pediatrician, General Physician, Dermatologist)
-- - Fortis Healthcare: 3 doctors (Gastroenterologist, Gynecologist, Pulmonologist)
-- - Max Healthcare: 3 doctors (Endocrinologist, Urologist, Psychiatrist)
--
-- All doctors are:
-- - Available (is_available = true)
-- - Verified (is_verified = true)
-- - Have realistic ratings (4.5 - 4.9)
-- - Have consultation fees (₹400 - ₹900)
-- - Have experience (8-18 years)
--
-- Login Credentials for all doctors:
-- Password: Doctor@123
-- ============================================================================
