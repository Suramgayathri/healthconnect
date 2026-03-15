# Running HealthConnect Locally

Follow these step-by-step instructions to get the HealthConnect platform running locally on your machine.

## Prerequisites
- **Java 17** installed (`java -version`)
- **Maven** installed (`mvn -version`)
- **MySQL Server 8.x** running locally on port `3306`.

## 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench, DBeaver, or CLI).
2. Connect using `root` and password `system`. (If your configuration differs, update `src/main/resources/application.yml`).
3. Execute the provided schema file:
   - File: `phase3_and_phase4_schema.sql`
   - This will create the `healthconnect` database, all necessary tables, and insert sample data including users.

## 2. Compile and Build
Open a terminal in the project root directory (`c:\Users\VICTUS\OneDrive\Documents\healthconnect\healthconnect`):

```bash
mvn clean install -DskipTests
```
*Note: We skip tests initially to ensure a smooth build, as MockMvc tests might require specific context setups.*

## 3. Run the Application
Start the Spring Boot server:

```bash
mvn spring-boot:run
```

Alternatively, run the compiled JAR:
```bash
java -jar target/healthconnect-0.0.1-SNAPSHOT.jar
```

The server will start on `http://localhost:8080`.

## 4. Accessing the Application
Open your web browser and navigate to the local portal:

**URL:** `http://localhost:8080/index.html` (or simply `http://localhost:8080/` depending on static routing).

### Sample Credentials

The `phase3_and_phase4_schema.sql` script creates several default users. All users share the same default password.

**Password for ALL accounts:** `password`

#### 🏥 Admin Access
- **Username:** `admin`
- *Features: System overview (Phase 1/2)*

#### 👨‍⚕️ Doctor Access
- **Username:** `dr_smith` (Dr. Sarah Smith - Cardiology)
- **Username:** `dr_jones` (Dr. Robert Jones - General Practice)
- *Features: View Schedule, Manage Patients, Record Vitals, Generate PDF Prescriptions*

#### 🤒 Patient Access
- **Username:** `johndoe` (John Doe)
- **Username:** `janedoe` (Jane Doe)
- *Features: Book Appointments, View Medical Records, Download Prescriptions, View Vitals chart*

## 5. Troubleshooting
- **Port In Use:** If port 8080 is taken, update `application.yml` with `server.port: 8081`.
- **Database Connection Error:** Ensure MySQL is strictly running on 3306 with `root:system` credentials. Update `application.yml` `spring.datasource` if your local DB uses different auth.
- **JWT Key Error:** A secure 256-bit key is pre-configured in `application.yml`. Do not modify it unless you intend to invalidate all current test tokens.
- **Upload Directories:** The app will automatically create `uploads/records` and `uploads/prescriptions` in the root directory upon the first file operation. Ensure the app has write permissions.
