-- Update all users with correct BCrypt hash for password "password"
UPDATE users SET password_hash = '$2a$10$eb9x/Uypnp/JUmzNZt03ceS4DilyPgRrmXJQW3sJnykEV4yK4j54i' 
WHERE user_id IN (1,2,3,4,5);
