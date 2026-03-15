-- Check if hospitals table exists and has data
SELECT COUNT(*) as hospital_count FROM hospitals;

-- Show all hospitals
SELECT hospital_id, hospital_name, city, phone FROM hospitals;

-- Check if doctors have hospital_id
SELECT doctor_id, full_name, specialization, hospital_id FROM doctors WHERE hospital_id IS NOT NULL LIMIT 10;
