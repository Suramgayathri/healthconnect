# Hospital Search Not Showing - Troubleshooting Guide

## Issue Fixed
The `/api/hospitals` endpoint was requiring authentication but wasn't accessible. I've updated the security configuration to allow public access to hospital endpoints.

## Changes Made

### 1. Security Configuration Updated
**File**: `src/main/java/com/digitalclinic/appointmentsystem/config/SecurityConfig.java`

Added public access to:
- `/api/hospitals/**` - All hospital endpoints
- `/api/doctors/search` - Doctor search
- `/api/doctors/hospital/**` - Doctors by hospital

### 2. Enhanced Error Logging
**File**: `src/main/resources/static/js/hospital_search.js`

Added detailed console logging to help debug issues:
- Request URL
- Auth token status
- Response status
- Number of hospitals loaded
- Detailed error messages

### 3. Application Rebuilt
Successfully compiled with all changes.

## Step-by-Step Fix Instructions

### Step 1: Check if Hospitals Exist in Database

Run this command:
```bash
check_database.bat
```

This will show:
- Number of hospitals in database
- List of all hospitals
- Doctors linked to hospitals

**Expected Output:**
```
hospital_count: 10
hospital_id | hospital_name | city | phone
1 | Apollo Hospital | Mumbai | +91-22-12345678
2 | Fortis Hospital | Delhi | +91-11-23456789
...
```

**If you see 0 hospitals**, run the SQL script:
```bash
run_hospital_data.bat
```

### Step 2: Restart the Application

**Stop the current application** (Ctrl+C in the terminal where it's running)

**Start it again:**
```bash
mvn spring-boot:run
```

Or if using the JAR:
```bash
java -jar target/healthconnect-0.0.1-SNAPSHOT.jar
```

### Step 3: Clear Browser Cache

1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

Or:
- Chrome: Ctrl+Shift+Delete → Clear cached images and files
- Firefox: Ctrl+Shift+Delete → Cached Web Content

### Step 4: Test the Hospital Search

1. **Login as Patient**
   - Go to http://localhost:8080
   - Login with patient credentials

2. **Navigate to Find Hospitals**
   - Click "Find Hospitals" button on dashboard
   - Or go directly to: http://localhost:8080/hospital_search.html

3. **Check Browser Console**
   - Press F12 to open DevTools
   - Go to Console tab
   - Look for these messages:
     ```
     Fetching hospitals from: http://localhost:8080/api/hospitals
     Auth token: Present
     Response status: 200
     Loaded hospitals: [...]
     Number of hospitals: 10
     ```

### Step 5: Test API Directly

Open a new browser tab and test the API directly:

**Test 1: Get All Hospitals**
```
http://localhost:8080/api/hospitals
```

**Expected Response:**
```json
[
  {
    "hospitalId": 1,
    "hospitalName": "Apollo Hospital",
    "hospitalAddress": "123 Main Street, Andheri",
    "city": "Mumbai",
    "state": "Maharashtra",
    "phone": "+91-22-12345678",
    ...
  },
  ...
]
```

**Test 2: Search Hospitals**
```
http://localhost:8080/api/hospitals/search?query=Mumbai
```

**Test 3: Get Hospitals by City**
```
http://localhost:8080/api/hospitals/city/Mumbai
```

## Common Issues and Solutions

### Issue 1: "Failed to load hospitals: 401"
**Cause**: Authentication issue (shouldn't happen now with public access)
**Solution**: 
- Restart application
- Clear browser cache
- Re-login

### Issue 2: "Failed to load hospitals: 404"
**Cause**: Application not running or wrong URL
**Solution**:
- Verify application is running on port 8080
- Check console for startup errors
- Ensure no other application is using port 8080

### Issue 3: Empty Response []
**Cause**: No hospitals in database
**Solution**:
```bash
run_hospital_data.bat
```

### Issue 4: "No hospitals found in database"
**Cause**: SQL script not executed
**Solution**:
1. Run `check_database.bat` to verify
2. If empty, run `run_hospital_data.bat`
3. Restart application

### Issue 5: CORS Error
**Cause**: Frontend and backend on different origins
**Solution**: Already configured in SecurityConfig, but verify:
- Frontend: http://localhost:8080
- Backend: http://localhost:8080
- Should be same origin

### Issue 6: Network Error
**Cause**: Application not running
**Solution**:
```bash
mvn spring-boot:run
```

## Verification Checklist

- [ ] Database has hospitals (run `check_database.bat`)
- [ ] Application is running (check http://localhost:8080)
- [ ] Logged in as PATIENT
- [ ] Browser cache cleared
- [ ] Console shows no errors
- [ ] API endpoint returns data (test in browser)

## Debug Commands

### Check Application Status
```bash
# Windows
netstat -ano | findstr :8080

# If running, you'll see:
TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING    12345
```

### Check Database Connection
```bash
mysql -u root -p -e "USE healthsystem; SELECT COUNT(*) FROM hospitals;"
```

### View Application Logs
Look for these in the console where application is running:
```
Started HealthConnectApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

## Still Not Working?

If hospitals still don't show after following all steps:

1. **Check browser console** (F12 → Console tab)
   - Copy any error messages

2. **Check application logs**
   - Look for errors in the terminal where app is running

3. **Test API with curl**
   ```bash
   curl http://localhost:8080/api/hospitals
   ```

4. **Verify database**
   ```bash
   mysql -u root -p healthsystem
   SELECT * FROM hospitals;
   ```

5. **Check if table exists**
   ```bash
   mysql -u root -p healthsystem
   SHOW TABLES LIKE 'hospitals';
   ```

## Quick Fix Summary

1. Run SQL script: `run_hospital_data.bat`
2. Restart application: `mvn spring-boot:run`
3. Clear browser cache
4. Login and navigate to Find Hospitals
5. Check console for errors

The issue should now be resolved!
