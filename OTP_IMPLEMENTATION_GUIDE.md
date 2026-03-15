# OTP Implementation Guide

## Overview
Real OTP (One-Time Password) verification has been implemented for user registration in HealthConnect.

## Features Implemented

### Backend Components

1. **OtpVerification Entity** (`model/OtpVerification.java`)
   - Stores OTP codes with email/phone
   - 6-digit secure random OTP
   - 10-minute expiration
   - Max 3 verification attempts
   - Auto-timestamps

2. **OtpService** (`service/OtpService.java`)
   - `sendOtp()` - Generates and sends OTP via email
   - `verifyOtp()` - Validates OTP code
   - `cleanupExpiredOtps()` - Removes expired OTPs

3. **EmailService** (`service/EmailService.java`)
   - Sends OTP emails
   - Falls back to console logging if email not configured
   - Production-ready for SMTP configuration

4. **API Endpoints** (`controller/AuthController.java`)
   - `POST /api/auth/send-otp` - Send OTP to email
   - `POST /api/auth/verify-otp` - Verify OTP code

### Frontend Updates

1. **register.html**
   - 6-digit OTP input fields
   - Resend OTP functionality

2. **register.js**
   - `showOtp()` - Calls backend to send OTP
   - `resendOtp()` - Resends OTP
   - OTP verification before registration

## How It Works

### Registration Flow

1. User fills registration form
2. Clicks "Send OTP" button
3. Backend generates 6-digit OTP and sends to email
4. User enters OTP in 6 input fields
5. Backend verifies OTP
6. If valid, registration proceeds
7. User is redirected to login

### Security Features

- OTPs expire after 10 minutes
- Maximum 3 verification attempts per OTP
- Secure random number generation
- Email uniqueness validation
- OTP stored in database with timestamps

## Configuration

### Development Mode (Current)
OTPs are logged to console. Check application logs for OTP codes:
```
=== OTP EMAIL ===
To: user@example.com
Subject: HealthConnect - Your OTP Code
Body: Your OTP code is: 123456
=================
```

### Production Mode (Email Sending)

Add to `application.yml`:

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
```

#### Gmail Setup:
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password in configuration

#### Other SMTP Providers:
- **SendGrid**: smtp.sendgrid.net:587
- **Mailgun**: smtp.mailgun.org:587
- **AWS SES**: email-smtp.region.amazonaws.com:587

## Testing

### Test the OTP Flow:

1. Start the application:
   ```bash
   ./mvnw spring-boot:run
   ```

2. Open browser: http://localhost:8080/register.html

3. Fill registration form and click "Send OTP"

4. Check console logs for OTP code

5. Enter OTP and complete registration

### API Testing with curl:

```bash
# Send OTP
curl -X POST http://localhost:8080/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phone":"1234567890"}'

# Verify OTP
curl -X POST http://localhost:8080/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otpCode":"123456"}'
```

## Database Schema

The `otp_verifications` table is auto-created:

```sql
CREATE TABLE otp_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    otp_code VARCHAR(6) NOT NULL,
    created_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0
);
```

## Future Enhancements

1. **SMS OTP**: Integrate Twilio for SMS delivery
2. **Rate Limiting**: Prevent OTP spam
3. **Scheduled Cleanup**: Auto-delete expired OTPs
4. **OTP Resend Cooldown**: Limit resend frequency
5. **Multi-channel**: Support both email and SMS

## Troubleshooting

### OTP not received in email
- Check console logs for OTP code (development mode)
- Verify email configuration in application.yml
- Check spam folder
- Verify SMTP credentials

### "Invalid or expired OTP" error
- OTP expires after 10 minutes
- Maximum 3 attempts allowed
- Request new OTP using "Resend OTP"

### Email already registered
- OTP sending checks if email exists
- Use different email or login with existing account

## Dependencies Added

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

Run `./mvnw clean install` to download dependencies.
