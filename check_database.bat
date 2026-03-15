@echo off
echo ============================================
echo Checking Database for Hospitals and Doctors
echo ============================================
echo.
echo Please enter your MySQL root password when prompted
echo.
mysql -u root -p healthsystem < check_hospitals.sql
echo.
echo ============================================
echo Check completed!
echo ============================================
pause
