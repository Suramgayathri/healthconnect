-- Phase 5 Schema Updates (Payments and Notifications)

-- Assuming 'users' and 'appointments' tables exist from Phase 3/4.

CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    provider VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE RESTRICT
);

-- =========================================
-- Sample Data Insertion
-- =========================================

-- Note: user_id 2 usually represents the Patient, and user_id 3 the Doctor in standard seed data.
-- Replace with actual valid user_id and appointment_id from your DB.

INSERT INTO notifications (user_id, title, message, type, is_read) 
VALUES 
(2, 'Platform Update', 'Welcome to HealthConnect Phase 5 capabilities including Secure Payments!', 'SYSTEM', FALSE),
(3, 'Welcome Doctor', 'You can now receive real-time updates seamlessly.', 'SYSTEM', TRUE);

-- Mock payment data for an existing appointment (Assuming appointment_id 1 is valid)
-- INSERT INTO payments (appointment_id, amount, provider, transaction_id, status) VALUES (1, 150.00, 'MOCK_STRIPE', 'TX-9A8B7C6D5E', 'SUCCESS');
