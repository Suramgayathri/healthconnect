-- Generate new BCrypt hash for "password"
-- Using online BCrypt generator
-- Password: password
-- Rounds: 10
-- New hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkm

UPDATE users SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhkm' WHERE user_id IN (1,2,3,4,5);
