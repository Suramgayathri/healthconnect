# 🚀 Quick Insert Sample Data

## One-Command Setup

Copy and paste this into your MySQL client to insert all sample doctors:

```sql
-- Run this in MySQL Workbench or command line
SOURCE src/main/resources/sample_doctors_data.sql;
```

Or if you're in a different directory:

```bash
# From project root
mysql -u root -p healthsystem < src/main/resources/sample_doctors_data.sql
```

---

## What Gets Inserted

### 12 Doctors across 4 Hospitals

**Apollo Hospitals (3 doctors)**
- Dr. Ramesh Kumar - Cardiologist - ₹800
- Dr. Priya Sharma - Neurologist - ₹700
- Dr. Anil Verma - Orthopedic Surgeon - ₹900

**City General Hospital (3 doctors)**
- Dr. Sunita Reddy - Pediatrician - ₹500
- Dr. Rajesh Patel - General Physician - ₹400
- Dr. Kavita Singh - Dermatologist - ₹600

**Fortis Healthcare (3 doctors)**
- Dr. Amit Gupta - Gastroenterologist - ₹750
- Dr. Neha Joshi - Gynecologist - ₹650
- Dr. Vikram Mehta - Pulmonologist - ₹700

**Max Healthcare (3 doctors)**
- Dr. Anjali Desai - Endocrinologist - ₹650
- Dr. Suresh Kumar - Urologist - ₹800
- Dr. Pooja Nair - Psychiatrist - ₹600

---

## Verify Installation

```sql
-- Quick check
SELECT hospital_name, COUNT(*) as doctors
FROM doctors
WHERE hospital_name IS NOT NULL
GROUP BY hospital_name;
```

**Expected Output:**
```
+------------------------+---------+
| hospital_name          | doctors |
+------------------------+---------+
| Apollo Hospitals       |       3 |
| City General Hospital  |       3 |
| Fortis Healthcare      |       3 |
| Max Healthcare         |       3 |
+------------------------+---------+
```

---

## Test Immediately

1. Go to: http://localhost:8080/hospital_search.html
2. Search for "Apollo"
3. Click "Book Appointment"
4. See 3 doctors!

---

**That's it! Your system now has sample data ready for testing.** ✅

For detailed information, see: **SAMPLE_DATA_GUIDE.md**
