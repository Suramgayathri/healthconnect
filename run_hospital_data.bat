@echo off
echo ============================================
echo Running Hospital and Doctor Data SQL Script
echo ============================================
echo.
echo Please enter your MySQL root password when prompted
echo.
mysql -u root -p healthsystem < src/main/resources/complete_hospital_doctor_data.sql
echo.
echo ============================================
echo Script execution completed!
echo ============================================
pause
