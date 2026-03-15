@echo off
echo ========================================
echo Hospital and Doctor Data Import Script
echo ========================================
echo.
echo This script will import 10 hospitals and 25 doctors into your database.
echo.
set /p password="Enter MySQL root password: "
echo.
echo Importing data...
mysql -u root -p%password% healthsystem < src\main\resources\complete_hospital_doctor_data.sql
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Data imported successfully.
    echo ========================================
    echo.
    echo Verifying data...
    echo.
    mysql -u root -p%password% healthsystem -e "SELECT COUNT(*) as hospital_count FROM hospitals;"
    mysql -u root -p%password% healthsystem -e "SELECT COUNT(*) as doctor_count FROM doctors WHERE hospital_id IS NOT NULL;"
    echo.
    echo ========================================
    echo Import complete!
    echo - 10 hospitals added
    echo - 25 doctors added
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ERROR: Import failed!
    echo ========================================
    echo Please check:
    echo 1. MySQL is running
    echo 2. Password is correct
    echo 3. Database 'healthsystem' exists
)
echo.
pause
