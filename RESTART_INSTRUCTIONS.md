# 🔄 SERVER RESTART INSTRUCTIONS

## Why Restart is Needed

Two new HTML files were created after the server started:
- `admin_reports.html`
- `admin_settings.html`

These files exist in the filesystem but are not yet loaded by the running Spring Boot application.

---

## How to Restart

### Step 1: Stop Current Server
In the terminal where the server is running, press:
```
Ctrl + C
```

Wait for the server to shut down completely (you'll see "Stopped" messages).

### Step 2: Navigate to Project Directory
```bash
cd healthconnect/healthconnect
```

### Step 3: Start Server
```bash
mvn spring-boot:run
```

Or if you prefer to run the compiled JAR:
```bash
mvn clean package -DskipTests
java -jar target/appointment-system-0.0.1-SNAPSHOT.jar
```

### Step 4: Wait for Startup
Wait for the message:
```
Started AppointmentSystemApplication in X.XXX seconds
```

---

## Verify Restart Success

### Test the Previously Failing Pages

1. **Admin Reports Page:**
   ```
   http://localhost:8080/admin_reports.html
   ```
   Expected: HTTP 200 OK (page loads)

2. **Admin Settings Page:**
   ```
   http://localhost:8080/admin_settings.html
   ```
   Expected: HTTP 200 OK (page loads)

### Quick Test Script (PowerShell)
```powershell
# Test both pages
$pages = @('admin_reports.html', 'admin_settings.html')
foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/$page" -UseBasicParsing
        Write-Host "✅ $page - Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ $page - Status: FAILED" -ForegroundColor Red
    }
}
```

---

## Expected Results After Restart

### Page Accessibility
- **Before Restart:** 20/22 pages (90.9%)
- **After Restart:** 22/22 pages (100%)

### All Pages Should Return HTTP 200
```
✅ index.html
✅ login.html
✅ register.html
✅ patient_dashboard.html
✅ doctor_dashboard.html
✅ appointment_booking.html
✅ appointment_list.html
✅ appointment_details.html
✅ medical_records.html
✅ prescription_view.html
✅ doctor_patients.html
✅ doctor_patient_history.html
✅ doctor_profile.html
✅ doctor_search.html
✅ doctor_schedule.html
✅ checkout.html
✅ admin_dashboard.html
✅ admin_users.html
✅ admin_reports.html      ← Should now work
✅ admin_settings.html     ← Should now work
✅ profile.html
✅ forgot_password.html
```

---

## Troubleshooting

### If Server Won't Start

1. **Check if port 8080 is in use:**
   ```powershell
   Get-NetTCPConnection -LocalPort 8080
   ```

2. **Kill process using port 8080:**
   ```powershell
   $process = Get-NetTCPConnection -LocalPort 8080 | Select-Object -ExpandProperty OwningProcess
   Stop-Process -Id $process -Force
   ```

3. **Check MySQL is running:**
   ```powershell
   Get-Service -Name MySQL*
   ```

4. **Start MySQL if stopped:**
   ```powershell
   Start-Service -Name MySQL80
   ```

### If Pages Still Return 404

1. **Verify files exist:**
   ```powershell
   Test-Path "healthconnect/src/main/resources/static/admin_reports.html"
   Test-Path "healthconnect/src/main/resources/static/admin_settings.html"
   ```

2. **Check file permissions:**
   ```powershell
   Get-Acl "healthconnect/src/main/resources/static/admin_reports.html"
   ```

3. **Clear Maven cache and rebuild:**
   ```bash
   mvn clean install -DskipTests
   mvn spring-boot:run
   ```

---

## After Successful Restart

### Next Steps

1. **Test Admin Flow:**
   ```
   http://localhost:8080/login.html
   → Login as admin@healthconnect.com / password
   → Navigate to admin_dashboard.html
   → Click "Analytics & Reports" → Should load admin_reports.html
   → Click "System Settings" → Should load admin_settings.html
   ```

2. **Visual Verification:**
   - Check navbar loads correctly
   - Check sidebar navigation works
   - Check colors match design system
   - Check buttons are styled
   - Check no console errors

3. **Functional Testing:**
   - Test report generation buttons
   - Test settings form submission
   - Test navigation between admin pages

---

## Success Criteria

✅ Server starts without errors  
✅ All 22 pages return HTTP 200  
✅ Admin reports page loads with proper styling  
✅ Admin settings page loads with proper styling  
✅ No console errors in browser  
✅ Navigation works between all pages  

---

**Estimated Time:** 2-3 minutes  
**Difficulty:** Easy  
**Risk:** None (just a restart)

