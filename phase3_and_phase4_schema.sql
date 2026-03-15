-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS healthconnect;
USE healthconnect;

-- Users and Roles
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15),
    role VARCHAR(20) NOT NULL,
    account_status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
    patient_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    medical_history TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Doctors
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    qualifications TEXT NOT NULL,
    experience_years INT,
    consultation_fee DECIMAL(10,2) NOT NULL,
    about_me TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Clinic Locations
CREATE TABLE IF NOT EXISTS clinic_locations (
    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20),
    latitude DOUBLE,
    longitude DOUBLE,
    contact_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE
);

-- Doctor Locations (Many-to-Many via mapping)
CREATE TABLE IF NOT EXISTS doctor_locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    primary_location BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (location_id) REFERENCES clinic_locations(location_id)
);

-- Appointments (Phase 3 Core)
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    location_id BIGINT,
    appointment_date DATETIME NOT NULL,
    appointment_time VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    type VARCHAR(20) NOT NULL DEFAULT 'IN_PERSON',
    reason TEXT,
    is_emergency BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'NORMAL',
    symptoms TEXT,
    qr_code_url VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (location_id) REFERENCES clinic_locations(location_id)
);

-- Patient Vitals (Phase 4)
CREATE TABLE IF NOT EXISTS patient_vitals (
    vital_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    heart_rate INT,
    blood_pressure VARCHAR(20),
    temperature DOUBLE,
    weight DOUBLE,
    height DOUBLE,
    respiratory_rate INT,
    blood_sugar VARCHAR(20),
    oxygen_saturation INT,
    notes TEXT,
    record_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    recorded_by BIGINT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (recorded_by) REFERENCES users(user_id)
);

-- Medical Records (Phase 4)
CREATE TABLE IF NOT EXISTS medical_records (
    record_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    record_type VARCHAR(50) NOT NULL,
    record_name VARCHAR(150) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_by BIGINT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

-- Prescriptions & Medications (Phase 4)
CREATE TABLE IF NOT EXISTS prescriptions (
    prescription_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_id BIGINT,
    diagnosis TEXT,
    general_instructions TEXT,
    follow_up_notes TEXT,
    pdf_url VARCHAR(255),
    prescription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
);

CREATE TABLE IF NOT EXISTS prescription_medications (
    medication_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_id BIGINT NOT NULL,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(50),
    timing VARCHAR(100),
    instructions VARCHAR(255),
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE
);

-- ===========================================
-- INSERT SAMPLE DATA 
-- Passwords below are encrypted versions of "password" for BCrypt.
-- ===========================================

-- 1. Insert Users & Passwords (bcrypt hash of "password": $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGF4pPqN.Z8K4/rFXx6G)
INSERT IGNORE INTO users (user_id, username, password, email, first_name, last_name, role) VALUES 
(1, 'admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGF4pPqN.Z8K4/rFXx6G', 'admin@healthconnect.com', 'System', 'Admin', 'ADMIN'),
(2, 'dr_smith', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGF4pPqN.Z8K4/rFXx6G', 'dr.smith@healthconnect.com', 'Sarah', 'Smith', 'DOCTOR'),
(3, 'dr_jones', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGF4pPqN.Z8K4/rFXx6G', 'dr.jones@healthconnect.com', 'Robert', 'Jones', 'DOCTOR'),
(4, 'johndoe', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGF4pPqN.Z8K4/rFXx6G', 'john.doe@gmail.com', 'John', 'Doe', 'PATIENT'),
(5, 'janedoe', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGF4pPqN.Z8K4/rFXx6G', 'jane.doe@gmail.com', 'Jane', 'Doe', 'PATIENT');

-- 2. Insert Patients
INSERT IGNORE INTO patients (patient_id, user_id, date_of_birth, gender, blood_group) VALUES 
(1, 4, '1985-06-15', 'MALE', 'A+'),
(2, 5, '1992-09-21', 'FEMALE', 'O-');

-- 3. Insert Doctors
INSERT IGNORE INTO doctors (doctor_id, user_id, specialty, qualifications, experience_years, consultation_fee) VALUES 
(1, 2, 'Cardiology', 'MD, FACC', 15, 150.00),
(2, 3, 'General Practice', 'MD, Family Medicine', 8, 80.00);

-- 4. Clinic Locations
INSERT IGNORE INTO clinic_locations (location_id, name, address, city, state) VALUES 
(1, 'Main City Hospital', '123 Health Ave', 'Metropolis', 'NY'),
(2, 'Downtown Clinic', '456 Wellness Blvd', 'Metropolis', 'NY');

-- Map Doctors to Locations
INSERT IGNORE INTO doctor_locations (doctor_id, location_id, primary_location) VALUES 
(1, 1, TRUE), (2, 2, TRUE), (2, 1, FALSE);

-- 5. Appointments (Sample Data)
INSERT IGNORE INTO appointments (appointment_id, patient_id, doctor_id, location_id, appointment_date, appointment_time, status, reason, is_emergency) VALUES 
(1, 1, 1, 1, '2023-11-20 10:00:00', '10:00:00', 'COMPLETED', 'Routine Heart Checkup', FALSE),
(2, 1, 2, 2, '2023-11-25 14:30:00', '14:30:00', 'COMPLETED', 'Fever and Cough', FALSE),
(3, 2, 2, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), '09:00:00', 'CONFIRMED', 'Annual Physical', FALSE);

-- 6. Sample Vitals
INSERT IGNORE INTO patient_vitals (patient_id, heart_rate, blood_pressure, temperature, weight, height, oxygen_saturation) VALUES 
(1, 72, '120/80', 36.8, 80.5, 175.0, 99),
(1, 75, '125/82', 37.0, 81.0, 175.0, 98),
(2, 68, '115/75', 36.6, 62.0, 165.0, 100);

-- 7. Sample Prescriptions & Meds
INSERT IGNORE INTO prescriptions (prescription_id, patient_id, doctor_id, appointment_id, diagnosis, general_instructions) VALUES 
(1, 1, 2, 2, 'Viral Fever & Cough', 'Drink plenty of water. Rest for 3 days.'),
(2, 1, 1, 1, 'Mild Hypertension', 'Reduce sodium intake. Moderate exercise daily.');

INSERT IGNORE INTO prescription_medications (prescription_id, medicine_name, dosage, frequency, duration, timing) VALUES 
(1, 'Paracetamol', '500mg', '1-1-1', '3 days', 'After food'),
(1, 'Cough Syrup (Ascoril)', '10ml', '1-0-1', '5 days', 'After food'),
(2, 'Amlodipine', '5mg', '1-0-0', '30 days', 'Morning Empty Stomach');
