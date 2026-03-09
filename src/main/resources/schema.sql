-- Database: healthconnect

-- 1. users
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. patients
CREATE TABLE IF NOT EXISTS patients (
    patient_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    dob DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'),
    blood_group VARCHAR(5),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    emergency_contact VARCHAR(20),
    medical_history TEXT,
    allergies TEXT,
    chronic_conditions TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. doctors
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    qualifications VARCHAR(255),
    experience_years INT,
    license_number VARCHAR(100) UNIQUE,
    languages_spoken VARCHAR(255),
    about TEXT,
    profile_photo VARCHAR(255),
    consultation_fee DECIMAL(10, 2),
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. clinic_locations
CREATE TABLE IF NOT EXISTS clinic_locations (
    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    clinic_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    pincode VARCHAR(20),
    phone VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

-- 5. doctor_locations
CREATE TABLE IF NOT EXISTS doctor_locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    consultation_fee DECIMAL(10, 2),
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES clinic_locations(location_id) ON DELETE CASCADE
);

-- 6. doctor_schedules
CREATE TABLE IF NOT EXISTS doctor_schedules (
    schedule_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration INT NOT NULL DEFAULT 30, -- In minutes
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES clinic_locations(location_id) ON DELETE CASCADE
);

-- 7. appointments
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    consultation_type ENUM('IN_PERSON', 'VIDEO') DEFAULT 'IN_PERSON',
    reason_for_visit TEXT,
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'IN_PROGRESS') DEFAULT 'SCHEDULED',
    is_emergency BOOLEAN DEFAULT FALSE,
    urgency_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    consultation_duration INT, -- Actual duration in minutes
    consultation_fee DECIMAL(10, 2),
    payment_status ENUM('PENDING', 'PAID', 'REFUNDED', 'FAILED') DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    chief_complaint TEXT,
    symptoms TEXT,
    diagnosis TEXT,
    examination_notes TEXT,
    doctor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (location_id) REFERENCES clinic_locations(location_id)
);

-- 8. patient_vitals
CREATE TABLE IF NOT EXISTS patient_vitals (
    vital_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT,
    blood_pressure VARCHAR(20),
    heart_rate INT,
    temperature DECIMAL(5, 2),
    weight DECIMAL(5, 2),
    height DECIMAL(5, 2),
    bmi DECIMAL(5, 2),
    oxygen_saturation INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL
);

-- 9. prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
    prescription_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_id BIGINT NOT NULL,
    prescription_date DATE NOT NULL,
    diagnosis TEXT,
    instructions TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    pdf_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
);

-- 10. prescription_medications
CREATE TABLE IF NOT EXISTS prescription_medications (
    medication_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_id BIGINT NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id) ON DELETE CASCADE
);

-- 11. lab_tests
CREATE TABLE IF NOT EXISTS lab_tests (
    test_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT,
    patient_id BIGINT NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    test_type VARCHAR(100),
    ordered_date DATE NOT NULL,
    result_date DATE,
    results TEXT,
    report_url VARCHAR(255),
    status ENUM('ORDERED', 'SAMPLE_COLLECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED') DEFAULT 'ORDERED',
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- 12. medical_records
CREATE TABLE IF NOT EXISTS medical_records (
    record_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    record_type VARCHAR(50) NOT NULL, -- 'PRESCRIPTION', 'LAB_REPORT', 'SCAN', 'OTHER'
    record_name VARCHAR(100) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    uploaded_by BIGINT, -- user_id of uploader
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 13. payments
CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT,
    patient_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100) UNIQUE,
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    payment_date TIMESTAMP,
    refund_id VARCHAR(100),
    refund_date TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- 14. notifications
CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    appointment_id BIGINT,
    notification_type VARCHAR(50) NOT NULL, -- 'REMINDER', 'CONFIRMATION', 'CANCELLATION', etc.
    channel ENUM('EMAIL', 'SMS', 'WHATSAPP', 'IN_APP') NOT NULL,
    message TEXT NOT NULL,
    status ENUM('PENDING', 'SENT', 'FAILED', 'DELIVERED', 'READ') DEFAULT 'PENDING',
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL
);

-- 15. reviews
CREATE TABLE IF NOT EXISTS reviews (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_id BIGINT UNIQUE NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
);

-- 16. audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(100),
    record_id BIGINT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 17. system_settings
CREATE TABLE IF NOT EXISTS system_settings (
    setting_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 18. admin_audit_logs
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- ============================================
-- INSERT TEST DATA
-- ============================================

-- 1. Insert Users (5 users: 1 admin, 2 doctors, 2 patients)
-- Password for all users: "password" (BCrypt hash)
INSERT INTO users (email, phone, password_hash, role, is_active) VALUES
('admin@healthconnect.com', '+1234567890', '$2a$10$eb9x/Uypnp/JUmzNZt03ceS4DilyPgRrmXJQW3sJnykEV4yK4j54i', 'ADMIN', TRUE),
('dr.smith@healthconnect.com', '+1234567891', '$2a$10$eb9x/Uypnp/JUmzNZt03ceS4DilyPgRrmXJQW3sJnykEV4yK4j54i', 'DOCTOR', TRUE),
('dr.jones@healthconnect.com', '+1234567892', '$2a$10$eb9x/Uypnp/JUmzNZt03ceS4DilyPgRrmXJQW3sJnykEV4yK4j54i', 'DOCTOR', TRUE),
('john.doe@gmail.com', '+1234567893', '$2a$10$eb9x/Uypnp/JUmzNZt03ceS4DilyPgRrmXJQW3sJnykEV4yK4j54i', 'PATIENT', TRUE),
('jane.doe@gmail.com', '+1234567894', '$2a$10$eb9x/Uypnp/JUmzNZt03ceS4DilyPgRrmXJQW3sJnykEV4yK4j54i', 'PATIENT', TRUE);

-- 2. Insert Patients (2 patients)
INSERT INTO patients (user_id, full_name, dob, gender, blood_group, address, city, state, pincode, emergency_contact, medical_history, allergies, chronic_conditions) VALUES
(4, 'John Doe', '1985-06-15', 'MALE', 'O+', '123 Main Street', 'New York', 'NY', '10001', '+1234567895', 'No major medical history', 'None', 'None'),
(5, 'Jane Doe', '1990-03-22', 'FEMALE', 'A+', '456 Oak Avenue', 'Los Angeles', 'CA', '90001', '+1234567896', 'Asthma since childhood', 'Penicillin', 'Asthma');

-- 3. Insert Doctors (2 doctors)
INSERT INTO doctors (user_id, full_name, specialization, qualifications, experience_years, license_number, languages_spoken, about, consultation_fee, average_rating, total_reviews, is_available) VALUES
(2, 'Dr. John Smith', 'Cardiology', 'MBBS, MD (Cardiology)', 15, 'MED-12345', 'English, Spanish', 'Experienced cardiologist specializing in heart disease prevention and treatment', 150.00, 4.8, 120, TRUE),
(3, 'Dr. Sarah Jones', 'General Practice', 'MBBS, MD (General Medicine)', 10, 'MED-67890', 'English, French', 'General practitioner with focus on family medicine and preventive care', 100.00, 4.9, 95, TRUE);

-- 4. Insert Clinic Locations (3 locations)
INSERT INTO clinic_locations (clinic_name, address, city, state, pincode, phone, latitude, longitude) VALUES
('HealthConnect Main Clinic', '789 Medical Plaza', 'New York', 'NY', '10002', '+1234567800', 40.7128, -74.0060),
('HealthConnect West Clinic', '321 Healthcare Blvd', 'Los Angeles', 'CA', '90002', '+1234567801', 34.0522, -118.2437),
('HealthConnect Downtown', '555 Central Avenue', 'Chicago', 'IL', '60601', '+1234567802', 41.8781, -87.6298);

-- 5. Insert Doctor Locations (Link doctors to clinics)
INSERT INTO doctor_locations (doctor_id, location_id, consultation_fee, is_primary) VALUES
(1, 1, 150.00, TRUE),
(1, 3, 150.00, FALSE),
(2, 2, 100.00, TRUE),
(2, 1, 100.00, FALSE);

-- 6. Insert Doctor Schedules
INSERT INTO doctor_schedules (doctor_id, location_id, day_of_week, start_time, end_time, slot_duration, is_active) VALUES
-- Dr. Smith schedule at Main Clinic
(1, 1, 'MONDAY', '09:00:00', '17:00:00', 30, TRUE),
(1, 1, 'TUESDAY', '09:00:00', '17:00:00', 30, TRUE),
(1, 1, 'WEDNESDAY', '09:00:00', '17:00:00', 30, TRUE),
(1, 1, 'THURSDAY', '09:00:00', '17:00:00', 30, TRUE),
(1, 1, 'FRIDAY', '09:00:00', '13:00:00', 30, TRUE),
-- Dr. Jones schedule at West Clinic
(2, 2, 'MONDAY', '10:00:00', '18:00:00', 30, TRUE),
(2, 2, 'WEDNESDAY', '10:00:00', '18:00:00', 30, TRUE),
(2, 2, 'FRIDAY', '10:00:00', '18:00:00', 30, TRUE),
(2, 2, 'SATURDAY', '09:00:00', '13:00:00', 30, TRUE);

-- 7. Insert Sample Appointments
INSERT INTO appointments (booking_reference, patient_id, doctor_id, location_id, appointment_date, appointment_time, consultation_type, reason_for_visit, status, is_emergency, consultation_fee, payment_status) VALUES
('APT-2026-001', 1, 1, 1, '2026-03-15', '10:00:00', 'IN_PERSON', 'Regular checkup', 'SCHEDULED', FALSE, 150.00, 'PENDING'),
('APT-2026-002', 2, 2, 2, '2026-03-16', '14:00:00', 'VIDEO', 'Follow-up consultation', 'SCHEDULED', FALSE, 100.00, 'PAID'),
('APT-2026-003', 1, 2, 1, '2026-03-10', '11:00:00', 'IN_PERSON', 'Flu symptoms', 'COMPLETED', FALSE, 100.00, 'PAID');

-- 8. Insert Patient Vitals
INSERT INTO patient_vitals (patient_id, appointment_id, blood_pressure, heart_rate, temperature, weight, height, bmi, oxygen_saturation) VALUES
(1, 3, '120/80', 72, 98.6, 75.5, 175.0, 24.7, 98),
(2, NULL, '118/78', 68, 98.4, 62.0, 165.0, 22.8, 99);

-- 9. Insert Prescriptions
INSERT INTO prescriptions (patient_id, doctor_id, appointment_id, prescription_date, diagnosis, instructions, follow_up_required, follow_up_date) VALUES
(1, 2, 3, '2026-03-10', 'Viral Flu', 'Take medications as prescribed. Rest and drink plenty of fluids.', TRUE, '2026-03-17');

-- 10. Insert Prescription Medications
INSERT INTO prescription_medications (prescription_id, medicine_name, dosage, frequency, duration, instructions) VALUES
(1, 'Paracetamol', '500mg', 'Three times daily', '5 days', 'Take after meals'),
(1, 'Vitamin C', '1000mg', 'Once daily', '7 days', 'Take with water');

-- 11. Insert Lab Tests
INSERT INTO lab_tests (appointment_id, patient_id, test_name, test_type, ordered_date, status) VALUES
(3, 1, 'Complete Blood Count', 'Blood Test', '2026-03-10', 'ORDERED'),
(NULL, 2, 'Lipid Profile', 'Blood Test', '2026-03-12', 'SAMPLE_COLLECTED');

-- 12. Insert Medical Records
INSERT INTO medical_records (patient_id, record_type, record_name, file_url, uploaded_by) VALUES
(1, 'PRESCRIPTION', 'Flu Prescription - March 2026', '/uploads/prescriptions/prescription_1.pdf', 3),
(2, 'LAB_REPORT', 'Blood Test Results', '/uploads/lab_reports/lab_test_2.pdf', 2);

-- 13. Insert Payments
INSERT INTO payments (appointment_id, patient_id, amount, payment_method, transaction_id, status, payment_date) VALUES
(2, 2, 100.00, 'CREDIT_CARD', 'TXN-2026-001', 'SUCCESS', '2026-03-14 10:30:00'),
(3, 1, 100.00, 'DEBIT_CARD', 'TXN-2026-002', 'SUCCESS', '2026-03-10 11:45:00');

-- 14. Insert Notifications
INSERT INTO notifications (user_id, appointment_id, notification_type, channel, message, status, sent_at) VALUES
(4, 1, 'REMINDER', 'EMAIL', 'Reminder: You have an appointment with Dr. John Smith on March 15, 2026 at 10:00 AM', 'SENT', '2026-03-14 09:00:00'),
(5, 2, 'CONFIRMATION', 'SMS', 'Your appointment with Dr. Sarah Jones has been confirmed for March 16, 2026 at 2:00 PM', 'DELIVERED', '2026-03-14 15:30:00'),
(4, 3, 'CONFIRMATION', 'IN_APP', 'Your appointment has been completed. Please provide feedback.', 'READ', '2026-03-10 12:00:00');

-- 15. Insert Reviews
INSERT INTO reviews (patient_id, doctor_id, appointment_id, rating, review_text, is_verified) VALUES
(1, 2, 3, 5, 'Excellent doctor! Very thorough and caring. Highly recommend.', TRUE);

-- 16. Insert System Settings (for admin)
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('appointment_slot_duration', '30', 'Default appointment slot duration in minutes'),
('max_appointments_per_day', '20', 'Maximum appointments per doctor per day'),
('consultation_fee_currency', 'USD', 'Currency for consultation fees'),
('enable_video_consultation', 'true', 'Enable video consultation feature'),
('emergency_booking_enabled', 'true', 'Enable emergency appointment booking');

-- 17. Insert Admin Audit Logs
INSERT INTO admin_audit_logs (admin_id, action, entity_type, entity_id, details) VALUES
(1, 'USER_CREATED', 'USER', 2, 'Created doctor account for Dr. John Smith'),
(1, 'USER_CREATED', 'USER', 3, 'Created doctor account for Dr. Sarah Jones'),
(1, 'SYSTEM_SETTINGS_UPDATED', 'SETTINGS', NULL, 'Updated appointment slot duration to 30 minutes');
