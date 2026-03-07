# HealthConnect Phase 4: Medical Records & Prescriptions Module

## Features Implemented
Phase 4 elevates the portal from a scheduling tool to an Electronic Medical Record (EMR) system. It enables Doctors to input extensive data regarding a patient's physical state while securely archiving and presenting histories to the Patient.

### Medical History Panel
1. **Patient Vitals Form**: Doctors can dynamically input Height and Weight, triggering an automatic real-time calculation of the patient's BMI (`doctor_patient_history.html`).
2. **Records Viewer**: Patients have centralized viewing tabs mapping their lab reports, documents, and historical vitals dynamically mapped into line graphs using `Chart.js`.
3. **File Upload Controller**: Built into `MedicalRecordService`, records uploaded are safely ported via local `MultipartFile` handlers into localized directories.

### Dynamic PDF Prescription Generator
1. **Form Layout**: An interactive list where doctors actively append multiple rows of medication using `prescription_view.html`.
2. **Backend Engine**: Implements the `iText` dependency. Upon passing the medications payload, `PrescriptionService` crafts an architected A4-style PDF file.
3. **Auto-Download Hook**: Following save operations, the PDF url is pushed to the client and automatically invoked in a new window, bypassing tedious secondary interactions.

### Technical Elements Addressed
- **Entities**: `MedicalRecord`, `PatientVital`, `Prescription`, `PrescriptionMedication`, `LabTest`.
- **Relational Integrity**: Strict mapping where cascading Deletes cleanly wrap Medication components upon dropping a parent Prescription entity.
- **Service Integration**: Tested end-to-end via Mocked API instances spanning 2 critical Controller files.
