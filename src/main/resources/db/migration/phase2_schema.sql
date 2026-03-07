-- HealthConnect Phase 2 Schema Script
-- Run this if the DB isn't auto-updating using hibernate.ddl-auto: update

-- Create Clinic Locations Table
CREATE TABLE IF NOT EXISTS clinic_locations (
    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    clinic_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    facilities TEXT,
    operating_hours TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Note: doctor_locations, doctor_schedules and columns in patients/doctors tables 
-- will be generated automatically by Hibernate (ddl-auto: update).

-- Sample Clinic Locations
INSERT INTO clinic_locations (clinic_name, address, city, state, pincode, phone, facilities, operating_hours)
VALUES 
('Apollo Hospital Main', '123 Health Ave', 'New York', 'NY', '10001', '123-456-7890', 'Parking, Pharmacy, Lab', 'Mon-Sun: 24h'),
('City Care Clinic', '456 Wellness Blvd', 'New York', 'NY', '10002', '123-456-7891', 'Pharmacy', 'Mon-Fri: 9AM-8PM');

-- Assuming some users are already present in Phase 1 (e.g. users table)
-- One can insert dummy doctors mapping to existing users here.
-- This script ensures schema is ready if manual execution is preferred.
