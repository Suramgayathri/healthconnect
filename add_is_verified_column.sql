-- Migration script to add missing columns to doctors table
-- This fixes the 400 Bad Request error when approving doctors

-- Add is_verified column (required for admin approval workflow)
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE AFTER is_available;

-- Add specialty column if missing (separate from specialization)
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS specialty VARCHAR(100) AFTER full_name;

-- Add created_at and updated_at timestamps if missing
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER is_verified;

ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Optional: Update existing doctors to be verified
-- Uncomment the line below if you want existing doctors to be automatically verified
-- UPDATE doctors SET is_verified = TRUE WHERE is_available = TRUE;
