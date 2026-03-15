# 🚀 How to Run the SQL Script on Windows

## Method 1: Using MySQL Workbench (RECOMMENDED)

1. **Open MySQL Workbench**
2. **Connect to your database**
3. **Open the SQL file:**
   - Click: `File` → `Open SQL Script`
   - Navigate to: `src/main/resources/complete_hospital_doctor_data.sql`
   - Click `Open`
4. **Execute the script:**
   - Click the lightning bolt icon (⚡) or press `Ctrl+Shift+Enter`
   - Wait for completion (should take 5-10 seconds)
5. **Verify:**
   - Run: `SELECT COUNT(*) FROM hospitals;` (should return 10)
   - Run: `SELECT COUNT(*) FROM doctors;` (should return 25+)

---

## Method 2: Using PowerShell with Password

```powershell
# Replace YOUR_PASSWORD with your actual MySQL root password
$env:MYSQL_PWD="YOUR_PASSWORD"
Get-Content src/main/resources/complete_hospital_doctor_data.sql | mysql -u root healthsystem
```

---

## Method 3: Using MySQL Command Line

1. **Open MySQL Command Line Client** (from Start Menu)
2. **Enter your password**
3. **Run these commands:**

```sql
USE healthsystem;
SOURCE C:/Users/singa/OneDrive/Documents/healthsystem/src/main/resources/complete_hospital_doctor_data.sql;
```

Note: Adjust the path if your project is in a different location.

---

## Method 4: Copy-Paste in MySQL Workbench

1. **Open MySQL Workbench**
2. **Connect to your database**
3. **Open a new SQL tab**
4. **Copy the entire content** of `complete_hospital_doctor_data.sql`
5. **Paste into the SQL tab**
6. **Execute** (⚡ icon)

---

## Verification Queries

After running the script, verify the data:

```sql
-- Check hospitals
SELECT hospital_id, hospital_name, city FROM hospitals;

-- Check doctors
SELECT d.doctor_id, d.full_name, h.hospital_name 
FROM doctors d 
JOIN hospitals h ON d.hospital_id = h.hospital_id
LIMIT 10;

-- Count doctors per hospital
SELECT h.hospital_name, COUNT(d.doctor_id) as doctor_count
FROM hospitals h
LEFT JOIN doctors d ON h.hospital_id = d.hospital_id
GROUP BY h.hospital_id, h.hospital_name
ORDER BY doctor_count DESC;
```

**Expected Results:**
- 10 hospitals
- 25 doctors
- Each hospital has 2-3 doctors

---

## Troubleshooting

### Error: "Table 'hospitals' already exists"
**Solution:** The script uses `CREATE TABLE IF NOT EXISTS`, so this is safe to ignore.

### Error: "Duplicate entry for key 'PRIMARY'"
**Solution:** The script uses `ON DUPLICATE KEY UPDATE`, so duplicates are handled.

### Error: "Unknown column 'hospital_id'"
**Solution:** Make sure the ALTER TABLE statement runs successfully.

---

## Quick Test After Import

```sql
-- Test hospital endpoint data
SELECT 
    hospital_id,
    hospital_name,
    city,
    phone,
    total_beds,
    emergency_services
FROM hospitals
WHERE is_active = true
LIMIT 5;

-- Test doctor-hospital relationship
SELECT 
    d.full_name,
    d.specialization,
    d.consultation_fee,
    h.hospital_name,
    h.city
FROM doctors d
JOIN hospitals h ON d.hospital_id = h.hospital_id
WHERE d.is_available = true
LIMIT 10;
```

---

## 🎉 Success Indicators

You'll know it worked when:
- ✅ No error messages in MySQL
- ✅ `SELECT COUNT(*) FROM hospitals;` returns 10
- ✅ `SELECT COUNT(*) FROM doctors WHERE hospital_id IS NOT NULL;` returns 25
- ✅ All doctors are linked to hospitals

---

**Recommended Method:** Use MySQL Workbench (Method 1) - it's the easiest and most reliable!
