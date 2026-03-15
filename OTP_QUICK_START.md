# OTP Quick Start Guide

## What Was Implemented

Real OTP verification for user registration with:
- 6-digit secure OTP codes
- Email delivery (console logging in dev mode)
- 10-minute expiration
- Resend OTP functionality
- Backend validation

## How to Test

### 1. Start the Application
```bash
./mvnw spring-boot:run
```

### 2. Open Registration Page
Navigate to: http://localhost:8080/register.html

### 3. Fill the Form
- Enter your details (name, email, phone, password)
- Click "Send OTP"

### 4. Get OTP from Console
Check your terminal/console for output like:
```
=== OTP EMAIL ===
To: your-email@example.com
Body: Your OTP code is: 123456
=================
```

### 5. Enter OTP
- Type the 6-digit code in the input fields
- Click "Complete Registration"

### 6. Success!
You'll be redirected to login page.

## Production Setup (Optional)

To send real emails, add to `application.yml`:

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

## Files Created/Modified

### New Files:
- `model/OtpVerification.java` - OTP entity
- `repository/OtpVerificationRepository.java` - OTP data access
- `service/OtpService.java` - OTP business logic
- `service/EmailService.java` - Email sending
- `dto/OtpRequestDTO.java` - Send OTP request
- `dto/OtpVerifyDTO.java` - Verify OTP request

### Modified Files:
- `controller/AuthController.java` - Added OTP endpoints
- `js/register.js` - OTP frontend logic
- `register.html` - 6-digit OTP inputs
- `application.yml` - Email config comments
- `pom.xml` - Added mail dependency

## API Endpoints

- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/register` - Register user (after OTP)
