-- Migration: Remove invalid doctors with missing required fields
-- This migration removes doctors that don't have full_name or specialization

-- First, let's identify and log invalid doctors
SELECT 'Invalid doctors to be removed:' AS message;
SELECT d.doctor_id, d.full_name, d.specialization, u.email, u.phone
FROM doctors d
JOIN users u ON d.user_id = u.user_id
WHERE d.full_name IS NULL OR d.full_name = '' OR d.specialization IS NULL OR d.specialization = '';

-- Delete doctors with missing full_name
DELETE FROM doctors WHERE full_name IS NULL OR full_name = '';

-- Delete doctors with missing specialization
DELETE FROM doctors WHERE specialization IS NULL OR specialization = '';

-- Clean up orphaned user records for deleted doctors
DELETE FROM users WHERE user_id IN (
    SELECT user_id FROM doctors WHERE doctor_id NOT IN (SELECT doctor_id FROM doctors)
);

-- Verify remaining doctors
SELECT 'Remaining valid doctors:' AS message;
SELECT d.doctor_id, d.full_name, d.specialization, u.email
FROM doctors d
JOIN users u ON d.user_id = u.user_id;
