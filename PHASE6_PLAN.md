# Phase 6 Implementation Plan: Admin & Analytics

Phase 6 will focus on building the administrative backbone of HealthConnect, allowing privileged users to manage the platform, generate insights, and control system-wide settings.

## 1. Core Modules & Objectives

### A. Admin Dashboard
- **Objective:** Provide a high-level overview of platform health and activity.
- **Key Features:**
  - Real-time statistics (Total patients, active doctors, daily appointments).
  - Revenue summary (linked to the Payments module from Phase 5).
  - Recent critical activities and system alerts.

### B. Analytics & Reporting
- **Objective:** Generate actionable insights from accumulated data.
- **Key Features:**
  - **Appointment Trends:** Visually represent peak booking times, cancellation rates, and most frequent consultation types (In-person vs. Video).
  - **Financial Reports:** Monthly revenue generation, outstanding payments, and platform fee collection.
  - **Export Capabilities:** Allow admins to export data in CSV/PDF formats for external use (utilizing our existing iText integration).

### C. User Management
- **Objective:** Complete control over user accounts.
- **Key Features:**
  - **Directory:** Searchable list of all Patients and Doctors.
  - **Actions:** Ability to suspend, ban, or verify accounts (especially validating Doctor credentials).
  - **Roles:** Assign sub-admin roles or support staff permissions.

### D. System Settings
- **Objective:** Configure global application parameters without code changes.
- **Key Features:**
  - Global consultation fee adjustments or platform fee percentages.
  - Notification configurations (Toggle SMS vs. Email vs. In-App).
  - Business hours and global holiday calendars (to block out booking slots).

## 2. Technical Implementation Roadmap

### Backend (Batch 1)
- **Entities:** `SystemSetting`, `AdminAuditLog`
- **Repositories:** `SystemSettingRepository`, `AuditLogRepository`
- **Services:** `AnalyticsService` (aggregating data from Appointment and Payment repositories), `AdminUserService`
- **Controllers:** `AdminController`, `AnalyticsController`, `SettingsController`
- **Security:** Strict `@PreAuthorize("hasRole('ADMIN')")` applied to all new endpoints.

### Frontend (Batch 2)
- `admin_dashboard.html`: The central hub with Chart.js integration.
- `admin_users.html`: Data tables for user management.
- `admin_reports.html`: Financial and appointment analytics views.
- `admin_settings.html`: Configuration forms.

## 3. Verification Plan
- **Unit Tests:** Verify `AnalyticsService` calculates revenues and trends accurately. Ensure `AdminUserService` correctly toggles user statuses.
- **Integration Tests:** Validate that non-admin JWT tokens receive `403 Forbidden` when attempting to access Phase 6 endpoints.
- **UI Validation:** Ensure charts render dynamically based on backend data and tables support pagination/filtering.
