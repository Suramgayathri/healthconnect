-- ============================================================================
-- COMPLETE HOSPITAL AND DOCTOR DATA - 20+ Doctors across Multiple Hospitals
-- ============================================================================
-- This script creates hospitals table and inserts sample data
-- Password for all users: "Doctor@123" (BCrypt encoded)
-- ============================================================================

-- Create hospitals table if not exists
CREATE TABLE IF NOT EXISTS hospitals (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add hospital_id column to doctors table (check if exists first)
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'healthsystem' 
    AND TABLE_NAME = 'doctors' 
    AND COLUMN_NAME = 'hospital_id');

SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE doctors ADD COLUMN hospital_id BIGINT', 
    'SELECT "Column hospital_id already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint (check if exists first)
SET @fk_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'healthsystem' 
    AND TABLE_NAME = 'doctors' 
    AND CONSTRAINT_NAME = 'fk_doctor_hospital');

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE doctors ADD CONSTRAINT fk_doctor_hospital FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE SET NULL', 
    'SELECT "Foreign key fk_doctor_hospital already exists" AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;


-- ============================================================================
-- INSERT HOSPITALS (10 Hospitals)
-- ============================================================================

INSERT INTO hospitals (hospital_name, hospital_address, city, state, pincode, phone, email, website, total_beds, emergency_services, ambulance_services, description, facilities, image_url) VALUES
('Apollo Hospitals', 'Jubilee Hills, Road No. 72', 'Hyderabad', 'Telangana', '500033', '+91-40-2360-7777', 'info@apollohyd.com', 'www.apollohospitals.com', 500, true, true, 'Leading multi-specialty hospital with state-of-the-art facilities', 'ICU, Emergency, Cardiology, Neurology, Orthopedics, Radiology, Laboratory', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800'),
('Fortis Healthcare', 'Bannerghatta Road', 'Bangalore', 'Karnataka', '560076', '+91-80-6621-4444', 'contact@fortis.in', 'www.fortishealthcare.com', 400, true, true, 'Premium healthcare with advanced medical technology', 'Emergency, Surgery, Maternity, Pediatrics, Oncology, Diagnostics', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800'),
('Max Healthcare', 'Saket, Press Enclave Road', 'New Delhi', 'Delhi', '110017', '+91-11-2651-5050', 'info@maxhealthcare.com', 'www.maxhealthcare.in', 550, true, true, 'World-class healthcare services with international standards', 'Cardiac Sciences, Neurosciences, Oncology, Orthopedics, Emergency', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800'),
('Manipal Hospitals', 'HAL Airport Road', 'Bangalore', 'Karnataka', '560017', '+91-80-2502-4444', 'contact@manipalhospitals.com', 'www.manipalhospitals.com', 450, true, true, 'Comprehensive healthcare with expert medical professionals', 'Multi-specialty, Emergency, ICU, Diagnostics, Pharmacy', 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800'),
('KIMS Hospitals', 'Kondapur', 'Hyderabad', 'Telangana', '500084', '+91-40-4488-5555', 'info@kimshospitals.com', 'www.kimshospitals.com', 300, true, true, 'Advanced medical care with compassionate service', 'Cardiology, Neurology, Gastroenterology, Nephrology, Emergency', 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800'),
('Narayana Health', 'Bommasandra Industrial Area', 'Bangalore', 'Karnataka', '560099', '+91-80-7122-2222', 'info@narayanahealth.org', 'www.narayanahealth.org', 600, true, true, 'Affordable quality healthcare for all', 'Cardiac Surgery, Neurosurgery, Oncology, Orthopedics, Pediatrics', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800'),
('Yashoda Hospitals', 'Somajiguda', 'Hyderabad', 'Telangana', '500082', '+91-40-2344-4444', 'info@yashodahospitals.com', 'www.yashodahospitals.com', 350, true, true, 'Patient-centric care with advanced technology', 'Gastroenterology, Nephrology, Urology, Oncology, Emergency', 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800'),
('Columbia Asia Hospital', 'Whitefield', 'Bangalore', 'Karnataka', '560066', '+91-80-6614-5000', 'info@columbiaasia.com', 'www.columbiaasia.com', 200, true, true, 'International standard healthcare services', 'General Medicine, Surgery, Pediatrics, Orthopedics, Diagnostics', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800'),
('Care Hospitals', 'Banjara Hills, Road No. 1', 'Hyderabad', 'Telangana', '500034', '+91-40-6165-6565', 'info@carehospitals.com', 'www.carehospitals.com', 400, true, true, 'Excellence in healthcare delivery', 'Cardiology, Neurology, Orthopedics, Oncology, Emergency Care', 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800'),
('Rainbow Children Hospital', 'Banjara Hills', 'Hyderabad', 'Telangana', '500034', '+91-40-4455-5555', 'info@rainbowhospitals.in', 'www.rainbowhospitals.in', 250, true, true, 'Specialized pediatric and maternity care', 'Pediatrics, Neonatology, Pediatric Surgery, Maternity, NICU', 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800');


-- ============================================================================
-- INSERT USERS FOR DOCTORS (25 Doctors)
-- ============================================================================

INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_active, created_at, updated_at) VALUES
-- Apollo Hospitals (3 doctors)
('Ramesh', 'Kumar', 'dr.ramesh.kumar@apollo.com', '9876543210', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Priya', 'Sharma', 'dr.priya.sharma@apollo.com', '9876543211', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Anil', 'Verma', 'dr.anil.verma@apollo.com', '9876543212', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
-- Fortis Healthcare (3 doctors)
('Amit', 'Gupta', 'dr.amit.gupta@fortis.com', '9876543213', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Neha', 'Joshi', 'dr.neha.joshi@fortis.com', '9876543214', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Vikram', 'Mehta', 'dr.vikram.mehta@fortis.com', '9876543215', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
-- Max Healthcare (3 doctors)
('Anjali', 'Desai', 'dr.anjali.desai@maxhealth.com', '9876543216', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Suresh', 'Kumar', 'dr.suresh.kumar@maxhealth.com', '9876543217', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Pooja', 'Nair', 'dr.pooja.nair@maxhealth.com', '9876543218', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
-- Manipal Hospitals (3 doctors)
('Rajesh', 'Iyer', 'dr.rajesh.iyer@manipal.com', '9876543219', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Kavita', 'Menon', 'dr.kavita.menon@manipal.com', '9876543220', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Sanjay', 'Reddy', 'dr.sanjay.reddy@manipal.com', '9876543221', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
-- KIMS Hospitals (2 doctors)
('Lakshmi', 'Rao', 'dr.lakshmi.rao@kims.com', '9876543222', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Venkat', 'Krishna', 'dr.venkat.krishna@kims.com', '9876543223', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
-- Narayana Health (3 doctors)
('Deepak', 'Shetty', 'dr.deepak.shetty@narayana.com', '9876543224', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Meera', 'Nambiar', 'dr.meera.nambiar@narayana.com', '9876543225', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Arun', 'Kumar', 'dr.arun.kumar@narayana.com', '9876543226', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
-- Yashoda Hospitals (2 doctors)
('Sunita', 'Reddy', 'dr.sunita.reddy@yashoda.com', '9876543227', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Ravi', 'Prakash', 'dr.ravi.prakash@yashoda.com', '9876543228', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
-- Columbia Asia (2 doctors)
('Sarah', 'Thomas', 'dr.sarah.thomas@columbia.com', '9876543229', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('James', 'Wilson', 'dr.james.wilson@columbia.com', '9876543230', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
-- Care Hospitals (2 doctors)
('Madhavi', 'Latha', 'dr.madhavi.latha@care.com', '9876543231', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Prasad', 'Rao', 'dr.prasad.rao@care.com', '9876543232', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
-- Rainbow Children (2 doctors)
('Swathi', 'Reddy', 'dr.swathi.reddy@rainbow.com', '9876543233', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW()),
('Kiran', 'Kumar', 'dr.kiran.kumar@rainbow.com', '9876543234', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCa', 'DOCTOR', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE email = email;



-- ============================================================================
-- INSERT DOCTORS (25 Doctors across 10 Hospitals)
-- ============================================================================

-- Apollo Hospitals - 3 Doctors
INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Ramesh Kumar', 'Cardiologist', 'MBBS, MD (Cardiology), DM (Cardiology)', 'MCI-12345-CARD', 15, 'Expert in interventional cardiology and heart failure management', 'English, Hindi, Telugu', 800.00, 1, 4.8, 156, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.ramesh.kumar@apollo.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Priya Sharma', 'Neurologist', 'MBBS, MD (Medicine), DM (Neurology)', 'MCI-23456-NEURO', 12, 'Specialist in neurological disorders and stroke management', 'English, Hindi, Punjabi', 700.00, 1, 4.7, 142, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.priya.sharma@apollo.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Anil Verma', 'Orthopedic Surgeon', 'MBBS, MS (Orthopedics), MCh (Orthopedics)', 'MCI-34567-ORTHO', 18, 'Expert in joint replacement and sports injuries', 'English, Hindi, Marathi', 900.00, 1, 4.9, 203, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.anil.verma@apollo.com';

-- Fortis Healthcare - 3 Doctors
INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Amit Gupta', 'Gastroenterologist', 'MBBS, MD (Medicine), DM (Gastroenterology)', 'MCI-78901-GASTRO', 14, 'Expert in digestive system disorders and endoscopy', 'English, Hindi, Punjabi', 750.00, 2, 4.8, 134, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.amit.gupta@fortis.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Neha Joshi', 'Gynecologist', 'MBBS, MS (Obstetrics & Gynecology)', 'MCI-89012-OBGYN', 11, 'Specialist in high-risk pregnancies and infertility', 'English, Hindi, Marathi, Kannada', 650.00, 2, 4.9, 178, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.neha.joshi@fortis.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Vikram Mehta', 'Pulmonologist', 'MBBS, MD (Respiratory Medicine)', 'MCI-90123-PULMO', 13, 'Expert in respiratory diseases and critical care', 'English, Hindi, Gujarati', 700.00, 2, 4.7, 121, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.vikram.mehta@fortis.com';

-- Max Healthcare - 3 Doctors
INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Anjali Desai', 'Endocrinologist', 'MBBS, MD (Medicine), DM (Endocrinology)', 'MCI-01234-ENDO', 10, 'Expert in diabetes and thyroid disorders', 'English, Hindi, Gujarati, Marathi', 650.00, 3, 4.8, 145, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.anjali.desai@maxhealth.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Suresh Kumar', 'Urologist', 'MBBS, MS (General Surgery), MCh (Urology)', 'MCI-12340-URO', 16, 'Expert in kidney stone management and prostate diseases', 'English, Hindi, Tamil', 800.00, 3, 4.9, 189, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.suresh.kumar@maxhealth.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Pooja Nair', 'Psychiatrist', 'MBBS, MD (Psychiatry)', 'MCI-23401-PSYCH', 9, 'Specialist in anxiety, depression and behavioral disorders', 'English, Hindi, Malayalam', 600.00, 3, 4.7, 102, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.pooja.nair@maxhealth.com';


-- Manipal Hospitals - 3 Doctors
INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Rajesh Iyer', 'General Surgeon', 'MBBS, MS (General Surgery)', 'MCI-45678-SURG', 14, 'Expert in laparoscopic and minimally invasive surgery', 'English, Hindi, Tamil, Kannada', 700.00, 4, 4.8, 167, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.rajesh.iyer@manipal.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Kavita Menon', 'Dermatologist', 'MBBS, MD (Dermatology)', 'MCI-56789-DERM', 10, 'Specialist in skin disorders and cosmetic dermatology', 'English, Hindi, Malayalam, Kannada', 600.00, 4, 4.7, 134, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.kavita.menon@manipal.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Sanjay Reddy', 'Oncologist', 'MBBS, MD (Medicine), DM (Oncology)', 'MCI-67890-ONCO', 15, 'Expert in cancer treatment and chemotherapy', 'English, Hindi, Telugu, Kannada', 850.00, 4, 4.9, 198, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.sanjay.reddy@manipal.com';

-- KIMS Hospitals - 2 Doctors
INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Lakshmi Rao', 'Nephrologist', 'MBBS, MD (Medicine), DM (Nephrology)', 'MCI-78901-NEPH', 12, 'Expert in kidney diseases and dialysis management', 'English, Hindi, Telugu, Kannada', 700.00, 5, 4.8, 145, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.lakshmi.rao@kims.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Venkat Krishna', 'Cardiologist', 'MBBS, MD (Cardiology), DM (Cardiology)', 'MCI-89012-CARD2', 16, 'Specialist in cardiac interventions and heart diseases', 'English, Hindi, Telugu', 800.00, 5, 4.9, 187, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.venkat.krishna@kims.com';

-- Narayana Health - 3 Doctors
INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Deepak Shetty', 'Cardiac Surgeon', 'MBBS, MS (General Surgery), MCh (Cardiac Surgery)', 'MCI-90123-CSURG', 20, 'Renowned cardiac surgeon with 5000+ successful surgeries', 'English, Hindi, Kannada, Tamil', 1000.00, 6, 4.9, 256, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.deepak.shetty@narayana.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Meera Nambiar', 'Pediatrician', 'MBBS, MD (Pediatrics)', 'MCI-01234-PEDIA', 11, 'Specialist in child healthcare and vaccination', 'English, Hindi, Malayalam, Kannada', 500.00, 6, 4.7, 123, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.meera.nambiar@narayana.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Arun Kumar', 'Neurosurgeon', 'MBBS, MS (General Surgery), MCh (Neurosurgery)', 'MCI-12345-NSURG', 17, 'Expert in brain and spine surgery', 'English, Hindi, Tamil, Kannada', 950.00, 6, 4.9, 211, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.arun.kumar@narayana.com';

-- Yashoda Hospitals - 2 Doctors
INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Sunita Reddy', 'General Physician', 'MBBS, MD (General Medicine)', 'MCI-23456-GENMED', 10, 'Experienced in treating common ailments and chronic diseases', 'English, Hindi, Telugu', 400.00, 7, 4.6, 98, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.sunita.reddy@yashoda.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Ravi Prakash', 'Radiologist', 'MBBS, MD (Radiology)', 'MCI-34567-RADIO', 13, 'Expert in diagnostic imaging and interventional radiology', 'English, Hindi, Telugu', 600.00, 7, 4.8, 156, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.ravi.prakash@yashoda.com';

-- Columbia Asia - 2 Doctors
INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Sarah Thomas', 'ENT Specialist', 'MBBS, MS (ENT)', 'MCI-45678-ENT', 9, 'Specialist in ear, nose and throat disorders', 'English, Hindi, Malayalam', 550.00, 8, 4.7, 112, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.sarah.thomas@columbia.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'James Wilson', 'Ophthalmologist', 'MBBS, MS (Ophthalmology)', 'MCI-56789-OPTH', 12, 'Expert in eye care and cataract surgery', 'English, Hindi, Kannada', 600.00, 8, 4.8, 145, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.james.wilson@columbia.com';

-- Care Hospitals - 2 Doctors
INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Madhavi Latha', 'Rheumatologist', 'MBBS, MD (Medicine), DM (Rheumatology)', 'MCI-67890-RHEUM', 11, 'Specialist in arthritis and autoimmune diseases', 'English, Hindi, Telugu', 650.00, 9, 4.7, 134, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.madhavi.latha@care.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Prasad Rao', 'Anesthesiologist', 'MBBS, MD (Anesthesiology)', 'MCI-78901-ANES', 14, 'Expert in anesthesia and pain management', 'English, Hindi, Telugu', 700.00, 9, 4.8, 167, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.prasad.rao@care.com';

-- Rainbow Children Hospital - 2 Doctors
INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Swathi Reddy', 'Pediatric Surgeon', 'MBBS, MS (General Surgery), MCh (Pediatric Surgery)', 'MCI-89012-PSURG', 10, 'Specialist in pediatric surgical procedures', 'English, Hindi, Telugu', 750.00, 10, 4.9, 178, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.swathi.reddy@rainbow.com';

INSERT INTO doctors (user_id, full_name, specialization, qualifications, license_number, experience_years, about, languages_spoken, consultation_fee, hospital_id, average_rating, total_reviews, is_available, is_verified, created_at, updated_at)
SELECT u.user_id, 'Kiran Kumar', 'Neonatologist', 'MBBS, MD (Pediatrics), Fellowship in Neonatology', 'MCI-90123-NEO', 12, 'Expert in newborn and premature baby care', 'English, Hindi, Telugu, Tamil', 700.00, 10, 4.8, 156, true, true, NOW(), NOW()
FROM users u WHERE u.email = 'dr.kiran.kumar@rainbow.com';


-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all hospitals
SELECT hospital_id, hospital_name, city, phone, total_beds, emergency_services
FROM hospitals
ORDER BY hospital_name;

-- Check all doctors with their hospitals
SELECT 
    d.doctor_id,
    d.full_name,
    d.specialization,
    h.hospital_name,
    h.city,
    d.consultation_fee,
    d.experience_years,
    d.average_rating,
    d.is_available,
    d.is_verified
FROM doctors d
JOIN hospitals h ON d.hospital_id = h.hospital_id
ORDER BY h.hospital_name, d.full_name;

-- Count doctors per hospital
SELECT 
    h.hospital_name,
    h.city,
    COUNT(d.doctor_id) as doctor_count
FROM hospitals h
LEFT JOIN doctors d ON h.hospital_id = d.hospital_id
GROUP BY h.hospital_id, h.hospital_name, h.city
ORDER BY doctor_count DESC, h.hospital_name;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Total Hospitals: 10
-- Total Doctors: 25
--
-- Hospital Distribution:
-- 1. Apollo Hospitals (Hyderabad) - 3 doctors
-- 2. Fortis Healthcare (Bangalore) - 3 doctors
-- 3. Max Healthcare (New Delhi) - 3 doctors
-- 4. Manipal Hospitals (Bangalore) - 3 doctors
-- 5. KIMS Hospitals (Hyderabad) - 2 doctors
-- 6. Narayana Health (Bangalore) - 3 doctors
-- 7. Yashoda Hospitals (Hyderabad) - 2 doctors
-- 8. Columbia Asia Hospital (Bangalore) - 2 doctors
-- 9. Care Hospitals (Hyderabad) - 2 doctors
-- 10. Rainbow Children Hospital (Hyderabad) - 2 doctors
--
-- All doctors are:
-- - Linked to hospitals via hospital_id
-- - Available (is_available = true)
-- - Verified (is_verified = true)
-- - Have realistic ratings (4.6 - 4.9)
-- - Have consultation fees (₹400 - ₹1000)
-- - Have experience (9-20 years)
--
-- Login Credentials for all doctors:
-- Password: Doctor@123
-- ============================================================================
