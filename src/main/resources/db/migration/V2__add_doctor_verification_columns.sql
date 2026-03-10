-- Add missing columns to doctors table for verification workflow
-- This migration will run automatically on application startup

-- Add is_verified column if it doesn't exist
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE 
COMMENT 'Indicates if doctor is verified by admin';

-- Add specialty column if it doesn't exist (separate from specialization)
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS specialty VARCHAR(100) 
COMMENT 'Doctor specialty category';

-- Add created_at timestamp if it doesn't exist
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
COMMENT 'Record creation timestamp';

-- Add updated_at timestamp if it doesn't exist
ALTER TABLE doctors 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
COMMENT 'Record last update timestamp';
