-- Add hospital_name and hospital_address columns to doctors table
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS hospital_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS hospital_address TEXT;

-- Update existing doctors with hospital information
-- You can run these updates to assign doctors to hospitals

-- Example: Assign doctors to City General Hospital
UPDATE doctors 
SET hospital_name = 'City General Hospital',
    hospital_address = '123 Main Street, Downtown'
WHERE doctor_id IN (1, 2, 3);

-- Example: Assign doctors to Apollo Medical Center
UPDATE doctors 
SET hospital_name = 'Apollo Medical Center',
    hospital_address = '456 Health Avenue, Medical District'
WHERE doctor_id IN (4, 5);

-- Example: Assign doctors to St. Mary's Hospital
UPDATE doctors 
SET hospital_name = 'St. Mary''s Hospital',
    hospital_address = '789 Care Road, Westside'
WHERE doctor_id IN (6, 7);

-- View doctors with their hospitals
SELECT doctor_id, full_name, specialization, hospital_name, is_available, is_verified
FROM doctors
ORDER BY hospital_name, full_name;
