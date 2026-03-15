-- Add hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
    hospital_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    pincode VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    facilities TEXT,
    operating_hours VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add hospital_id to doctor_locations table
ALTER TABLE doctor_locations 
ADD COLUMN hospital_id BIGINT AFTER location_id,
ADD INDEX idx_hospital_id (hospital_id),
ADD CONSTRAINT fk_doctor_location_hospital 
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE SET NULL;

-- Add hospital_id and hospital_name columns to doctors table
ALTER TABLE doctors 
ADD COLUMN hospital_id BIGINT AFTER specialization,
ADD COLUMN hospital_name VARCHAR(100) AFTER hospital_id,
ADD INDEX idx_hospital_id (hospital_id),
ADD CONSTRAINT fk_doctor_hospital 
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE SET NULL;

-- Insert 10 sample hospitals
INSERT INTO hospitals (hospital_name, address, city, state, pincode, phone, email, website, latitude, longitude, description, facilities, operating_hours, is_verified) VALUES
('City General Hospital', '123 Medical Center Dr', 'New York', 'NY', '10001', '+12125550100', 'info@citygeneral.com', 'www.citygeneral.com', 40.7128, -74.0060, 'Comprehensive healthcare services with state-of-the-art facilities', 'Emergency Room, ICU, Surgery, Lab, Pharmacy', '24/7', TRUE),
('St. Mary''s Medical Center', '456 Health Ave', 'New York', 'NY', '10002', '+12125550101', 'contact@stmarys.com', 'www.stmarys.com', 40.7589, -73.9851, 'Trusted community hospital with specialized care units', 'Cardiology, Neurology, Orthopedics, Pediatrics', '24/7', TRUE),
('Westside Health Complex', '789 Wellness Blvd', 'Los Angeles', 'CA', '90001', '+13235550102', 'info@westsidehealth.com', 'www.westsidehealth.com', 34.0522, -118.2437, 'Modern healthcare facility serving Southern California', 'General Medicine, Dermatology, Dentistry, Eye Care', '8AM-8PM', TRUE),
('Eastside Medical Center', '321 Care Lane', 'Chicago', 'IL', '60601', '+13125550103', 'contact@eastside.com', 'www.eastside.com', 41.8781, -87.6298, 'Leading healthcare provider in the Midwest', 'Cancer Center, Heart Institute, Stroke Center', '24/7', TRUE),
('Southside Regional Hospital', '555 Recovery Rd', 'Houston', 'TX', '77001', '+17135550104', 'info@southside.com', 'www.southside.com', 29.7604, -95.3698, 'Regional referral center with advanced diagnostics', 'MRI, CT Scan, Surgery, Rehabilitation', '24/7', TRUE),
('Northview Health Campus', '888 Wellness Way', 'Phoenix', 'AZ', '85001', '+16025550105', 'contact@northview.com', 'www.northview.com', 33.4484, -112.0740, 'Comprehensive medical services for the Valley', 'Family Medicine, Pediatrics, Internal Medicine', '7AM-9PM', TRUE),
('Valley Medical Center', '111 Healing St', 'San Antonio', 'TX', '78201', '+12105550106', 'info@valleymed.com', 'www.valleymed.com', 29.4241, -98.4936, 'Community-focused hospital with expert specialists', 'General Surgery, Orthopedics, Ophthalmology', '8AM-7PM', TRUE),
('Metro Health Hospital', '222 Care Center', 'San Diego', 'CA', '92101', '+16195550107', 'contact@metrohealth.com', 'www.metrohealth.com', 32.7157, -117.1611, 'Urban hospital serving the metropolitan area', 'Emergency Services, ICU, Surgery, Maternity', '24/7', TRUE),
('Riverside Medical Center', '333 River Rd', 'Dallas', 'TX', '75201', '+12145550108', 'info@riversidemed.com', 'www.riversidemed.com', 32.7767, -96.7970, 'Academic medical center with research facilities', 'Clinical Research, Transplant Center, Cancer Institute', '24/7', TRUE),
('Sunrise Health Complex', '444 Sunrise Ave', 'San Jose', 'CA', '95101', '+14085550109', 'contact@sunrise.com', 'www.sunrise.com', 37.3382, -121.8863, 'Technology-driven healthcare for Silicon Valley', 'Telemedicine, Digital Health, Preventive Care', '9AM-6PM', TRUE);

-- Link existing doctors to hospitals
-- Dr. Smith (doctor_id=1) linked to City General Hospital (hospital_id=1)
UPDATE doctors SET hospital_id = 1, hospital_name = 'City General Hospital' WHERE doctor_id = 1;

-- Dr. Jones (doctor_id=2) linked to St. Mary's Medical Center (hospital_id=2)
UPDATE doctors SET hospital_id = 2, hospital_name = 'St. Mary''s Medical Center' WHERE doctor_id = 2;

-- Link doctors to hospitals via doctor_locations
-- Dr. Smith at City General Hospital
INSERT INTO doctor_locations (doctor_id, location_id, hospital_id, consultation_fee, is_primary) 
VALUES (1, 1, 1, 150.00, TRUE);

-- Dr. Smith at Valley Medical Center
INSERT INTO doctor_locations (doctor_id, location_id, hospital_id, consultation_fee, is_primary) 
VALUES (1, 3, 7, 150.00, FALSE);

-- Dr. Jones at St. Mary's Medical Center
INSERT INTO doctor_locations (doctor_id, location_id, hospital_id, consultation_fee, is_primary) 
VALUES (2, 2, 2, 100.00, TRUE);

-- Dr. Jones at Metro Health Hospital
INSERT INTO doctor_locations (doctor_id, location_id, hospital_id, consultation_fee, is_primary) 
VALUES (2, 1, 8, 100.00, FALSE);
