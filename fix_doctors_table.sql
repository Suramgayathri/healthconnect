-- Quick fix for doctors table - add missing columns
-- Run this in your MySQL database

USE healthconnect;

-- Add is_verified column if it doesn't exist
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE AFTER is_available;

-- Add specialty column if it doesn't exist  
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS specialty VARCHAR(100) AFTER full_name;

-- Add timestamps if they don't exist
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER is_verified;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Verify the changes
DESCRIBE doctors;
