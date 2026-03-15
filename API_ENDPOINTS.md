# HealthConnect API Endpoints Reference

This document maps out the core Rest API mappings constructed up to Phase 4.
> Note: ALL endpoints prefixed with `/api` require a valid JWT `Authorization: Bearer <token>` unless marked public.

## Auth (Phase 1/2)
- `POST /api/auth/login` (Public) - Payload: `{ username, password }`. Returns: JWT Token & details.
- `POST /api/auth/register` (Public) - Standard registration flow binding User to Patient role.

## Appointments (Phase 3)
- `POST /api/appointments` - Book a new appointment.
- `GET /api/appointments/patient/me` - Fetch all appointments relative to logged-in user context.
- `GET /api/appointments/doctor/me` - Fetch entire calendar schedule relative to logged-in doctor.
- `GET /api/appointments/{id}` - Fetch explicit details.
- `GET /api/appointments/{id}/qrcode` - Streams `IMAGE/PNG` representing entry pass.
- `POST /api/appointments/{id}/cancel` - Changes state to `CANCELLED`.
- `POST /api/appointments/{id}/confirm` (Doctor Only)
- `POST /api/appointments/{id}/complete` (Doctor Only)

## Vitals & Medical Records (Phase 4)
- `POST /api/vitals` (Doctor Only) - Logs new vital statistics.
- `GET /api/vitals/patient/{id}` - Retrieves chronological logs of vitals.
- `POST /api/records/upload` - Multipart form ingestor. Parses (`file`, `patientId`, `recordType`).
- `GET /api/records/patient/{id}` - Complete medical dossier query.
- `GET /api/records/download/{fileName}` - Streams `APPLICATION/OCTET-STREAM` for binary documents.

## Prescriptions (Phase 4)
- `POST /api/prescriptions` (Doctor Only) - Payload requires medications array. Returns complete context with mapping to PDF generation hook.
- `GET /api/prescriptions/patient/{id}`
- `GET /api/prescriptions/{id}`
- `GET /api/prescriptions/download/{fileName}` - Streams explicitly structured `APPLICATION/PDF`.
