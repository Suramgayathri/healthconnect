// ─────────────────────────────────────────────
//  State
// ─────────────────────────────────────────────
let allAppointments = [];
let doctorSchedules = [];
let doctorClinics = [];
let allSlots = [];
let currentDisplayDate = new Date();
let selectedDuration = 30;
let numericDoctorId = null; // cached once

// ─────────────────────────────────────────────
//  Bootstrap
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = 'login.html'; return; }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        ['token','doctorPublicId','userRole','userId','userEmail'].forEach(k => localStorage.removeItem(k));
        window.location.href = 'login.html';
    });

    initFilters();
    initModal();
    initGridNavigation();
    initDurationPills();
    initSlotPreview();
    initAppointmentModal();

    // Fetch static data once, then load today's appointments
    initPageData(token);
});

// ─────────────────────────────────────────────
//  One-time page init  (clinics + schedules + doctorId)
// ─────────────────────────────────────────────
async function initPageData(token) {
    document.getElementById('calendar-loader').style.display = 'flex';
    try {
        const [schedRes, clinicRes, profileRes] = await Promise.all([
            fetch('/api/doctors/schedules',  { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('/api/doctors/me/clinics', { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('/api/doctors/profile',    { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!schedRes.ok)   throw new Error('Failed to load schedules');
        if (!clinicRes.ok)  throw new Error('Failed to load clinics');
        if (!profileRes.ok) throw new Error('Failed to load profile');

        doctorSchedules = (await schedRes.json())  || [];
        doctorClinics   = (await clinicRes.json()) || [];
        const profile   = await profileRes.json();
        numericDoctorId = profile.doctorId;

        // Render the (static) working-hours card
        renderScheduleRules();

        // Now load appointments for the current display date
        await fetchAppointmentsForDate(currentDisplayDate, token);

    } catch (e) {
        console.error(e);
        showToast('Could not load page data: ' + e.message, 'error');
    } finally {
        document.getElementById('calendar-loader').style.display = 'none';
    }
}

// ─────────────────────────────────────────────
//  Per-date fetch  (appointments + slots)
// ─────────────────────────────────────────────
async function fetchAppointmentsForDate(date, token) {
    token = token || localStorage.getItem('token');
    document.getElementById('calendar-loader').style.display = 'flex';

    const dateStr = date.toISOString().split('T')[0];

    try {
        // Appointments for this specific date
        const appRes = await fetch(
            `/api/doctors/appointments?date=${dateStr}&size=100`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (!appRes.ok) throw new Error('Failed to load appointments');
        const appData = await appRes.json();
        allAppointments = appData.content || appData || [];

        // Slots for each clinic for this date
        allSlots = [];
        if (numericDoctorId && doctorClinics.length > 0) {
            const slotPromises = doctorClinics.map(c =>
                fetch(`/api/appointments/slots?doctorId=${numericDoctorId}&locationId=${c.locationId}&date=${dateStr}`,
                    { headers: { 'Authorization': `Bearer ${token}` } })
                .then(r => r.ok ? r.json() : [])
                .catch(() => [])
            );
            const results = await Promise.all(slotPromises);
            results.forEach(arr => { if (Array.isArray(arr)) allSlots = allSlots.concat(arr); });
        }

        renderScheduleGrid();
    } catch (e) {
        console.error(e);
        showToast('Could not load appointments: ' + e.message, 'error');
    } finally {
        document.getElementById('calendar-loader').style.display = 'none';
    }
}

// ─────────────────────────────────────────────
//  Navigation
// ─────────────────────────────────────────────
function initGridNavigation() {
    document.getElementById('prevDayBtn').addEventListener('click', () => {
        currentDisplayDate.setDate(currentDisplayDate.getDate() - 1);
        fetchAppointmentsForDate(currentDisplayDate);
    });
    document.getElementById('nextDayBtn').addEventListener('click', () => {
        currentDisplayDate.setDate(currentDisplayDate.getDate() + 1);
        fetchAppointmentsForDate(currentDisplayDate);
    });
}

function refreshSchedule() {
    fetchAppointmentsForDate(currentDisplayDate);
    closeAppointmentModal();
}

// ─────────────────────────────────────────────
//  Render: Working Hours (today only, all clinics)
// ─────────────────────────────────────────────
function renderScheduleRules() {
    const container = document.getElementById('schedule-rules-list');
    if (!container) return;

    if (doctorSchedules.length === 0) {
        container.innerHTML = '<p class="text-muted" style="font-size:0.9rem;">No working hours set. Click "Configure Slots" to set your schedule.</p>';
        return;
    }

    const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    const todayDOW = days[new Date().getDay()];

    const todaySchedules = doctorSchedules.filter(s => s.dayOfWeek === todayDOW);

    if (todaySchedules.length === 0) {
        container.innerHTML = `<p class="text-muted" style="font-size:0.9rem;">No working hours scheduled for today (${todayDOW.charAt(0) + todayDOW.slice(1).toLowerCase()}).</p>`;
        return;
    }

    let html = '<div class="rules-grid">';
    todaySchedules.forEach(schedule => {
        const clinic = doctorClinics.find(c => c.locationId === schedule.locationId);
        const clinicName = clinic ? clinic.clinicName : 'Unknown Clinic';
        html += `
            <div class="rule-card">
                <div class="rule-day"><i class="fas fa-calendar-day"></i> ${todayDOW.charAt(0) + todayDOW.slice(1).toLowerCase()}</div>
                <div class="rule-clinic"><i class="fas fa-map-marker-alt"></i> ${clinicName}</div>
                <div class="rule-time"><i class="far fa-clock"></i> ${formatTime(schedule.startTime)} – ${formatTime(schedule.endTime)}</div>
                ${schedule.breakStartTime ? `<div class="rule-break"><i class="fas fa-mug-hot"></i> Break: ${formatTime(schedule.breakStartTime)} – ${formatTime(schedule.breakEndTime)}</div>` : ''}
                <div class="rule-slots"><i class="fas fa-th-large"></i> ${schedule.slotDuration || 30}-min slots</div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// ─────────────────────────────────────────────
//  Render: Slots Grid
// ─────────────────────────────────────────────
function renderScheduleGrid() {
    const gridEl = document.getElementById('slotsGrid');
    if (!gridEl) return;

    const displayDateStr = currentDisplayDate.toISOString().split('T')[0];
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatted = currentDisplayDate.toLocaleDateString(undefined, options);

    document.getElementById('currentGridDate').textContent = dateFormatted;
    document.getElementById('addSlotBtnDate').textContent = dateFormatted;

    const allChecked = document.getElementById('filter-all').checked;
    const activeStatuses = Array.from(document.querySelectorAll('.status-filter')).filter(cb => cb.checked).map(cb => cb.value);
    const emChecked = document.getElementById('filter-emergency').checked;

    let blocks = [];

    // Available slots from API (skip BREAK entirely)
    allSlots.forEach(slot => {
        if (slot.status === 'BREAK') return; // ← skip break cards per spec
        if (slot.status === 'AVAILABLE') {
            // Per user request: Only show booked appointments, skip logging 'AVAILABLE' slots into the grid.
            // blocks.push({ type: 'SLOT', time: slot.startTime, ...slot });
        }
    });

    // Booked appointments for the day
    const dayAppointments = allAppointments.filter(app =>
        app.appointmentDate && app.appointmentDate.split('T')[0] === displayDateStr
    );

    dayAppointments.forEach(app => {
        if (!allChecked && !activeStatuses.includes(app.status)) return;
        const isEmergency = app.emergency === true || app.isEmergency === true ||
            (app.urgencyLevel && app.urgencyLevel !== null);
        if (emChecked && !isEmergency) return;
        blocks.push({ type: 'APPOINTMENT', time: app.appointmentTime || '00:00:00', ...app, isEmergency });
    });

    // Chronological order
    blocks.sort((a, b) => a.time.localeCompare(b.time));

    if (blocks.length === 0) {
        gridEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#6b7280;"><i class="fas fa-calendar-times" style="font-size:2rem;margin-bottom:1rem;display:block;"></i>No slots or appointments found for this date.</div>';
        return;
    }

    let html = '';
    blocks.forEach(b => {
        if (b.type === 'SLOT') {
            html += `
                <div class="slot-box available" onclick="openScheduleModalForDate(currentDisplayDate)">
                    <div class="slot-time"><span><i class="far fa-clock"></i> ${formatTime(b.startTime)}</span></div>
                    <div class="slot-patient">Available Open Slot</div>
                    <div class="slot-status available-status">Can Be Booked</div>
                </div>
            `;
        } else {
            let boxClass = 'booked';
            let statusBadgeColor = '#e0e7ff';
            let statusTextColor = 'var(--primary)';

            if (b.isEmergency && b.status !== 'COMPLETED') {
                boxClass = 'emergency'; statusBadgeColor = '#fecaca'; statusTextColor = '#b91c1c';
            } else if (b.status === 'COMPLETED') {
                statusBadgeColor = '#dcfce3'; statusTextColor = '#15803d';
            } else if (b.status === 'PENDING') {
                statusBadgeColor = '#fef3c7'; statusTextColor = '#b45309';
            } else if (b.status === 'CANCELLED') {
                statusBadgeColor = '#f1f5f9'; statusTextColor = '#64748b';
            }

            html += `
                <div class="slot-box ${boxClass}" onclick='openApptDetailModal(${JSON.stringify(b).replace(/'/g, "&apos;")})'>
                    <div class="slot-time">
                        <span><i class="far fa-clock"></i> ${formatTime(b.time)}</span>
                        ${b.isEmergency ? '<i class="fas fa-exclamation-circle text-danger" title="Emergency"></i>' : ''}
                    </div>
                    <div class="slot-patient">${b.patientName || 'Unknown Patient'}</div>
                    <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.5rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.reasonForVisit || 'General'}</div>
                    <div class="slot-status" style="background:${statusBadgeColor};color:${statusTextColor};">${b.status}</div>
                </div>
            `;
        }
    });

    gridEl.innerHTML = html;
}

// ─────────────────────────────────────────────
//  Appointment Detail Modal (popup)
// ─────────────────────────────────────────────
function initAppointmentModal() {
    document.getElementById('closeApptDetailBtn').onclick = closeAppointmentModal;
    window.addEventListener('click', e => {
        if (e.target === document.getElementById('apptDetailModal')) closeAppointmentModal();
    });
}

function closeAppointmentModal() {
    const m = document.getElementById('apptDetailModal');
    if (m) m.style.display = 'none';
}

window.openApptDetailModal = function(app) {
    const modal = document.getElementById('apptDetailModal');

    const statusColors = {
        'PENDING':    { bg: '#fef3c7', text: '#b45309' },
        'CONFIRMED':  { bg: '#d1fae5', text: '#065f46' },
        'COMPLETED':  { bg: '#e0e7ff', text: '#3730a3' },
        'CANCELLED':  { bg: '#f1f5f9', text: '#475569' },
        'IN_PROGRESS':{ bg: '#fde68a', text: '#92400e' },
        'SCHEDULED':  { bg: '#fef3c7', text: '#b45309' },
        'NO_SHOW':    { bg: '#fee2e2', text: '#b91c1c' }
    };
    const sc = statusColors[app.status] || { bg: '#e0e7ff', text: '#3730a3' };

    // Patient age from DOB
    let ageStr = '';
    if (app.patientDateOfBirth) {
        const dob = new Date(app.patientDateOfBirth);
        const ageDiff = Date.now() - dob.getTime();
        const ageDate = new Date(ageDiff);
        ageStr = Math.abs(ageDate.getUTCFullYear() - 1970) + ' yrs';
    }

    const fieldRow = (icon, label, value) => value
        ? `<div class="appt-field"><span class="appt-field-label"><i class="fas fa-${icon}"></i> ${label}</span><span class="appt-field-value">${value}</span></div>`
        : '';

    document.getElementById('apptDetailModalBody').innerHTML = `
        <div class="appt-modal-header-section">
            <div class="appt-patient-avatar">${(app.patientName || 'U').charAt(0).toUpperCase()}</div>
            <div>
                <div class="appt-patient-name">${app.patientName || 'Unknown Patient'}${app.isEmergency ? ' <span class="badge-emergency"><i class="fas fa-ambulance"></i> Emergency</span>' : ''}</div>
                <div class="appt-ref">${app.bookingReference || ''}</div>
            </div>
            <div class="appt-status-badge" style="background:${sc.bg};color:${sc.text};">${app.status}</div>
        </div>

        <div class="appt-section-title"><i class="fas fa-user"></i> Patient Information</div>
        <div class="appt-fields-grid">
            ${fieldRow('phone', 'Phone',      app.patientPhone)}
            ${fieldRow('venus-mars', 'Gender', app.patientGender)}
            ${fieldRow('tint', 'Blood Group', app.patientBloodGroup)}
            ${fieldRow('birthday-cake', 'Date of Birth', app.patientDateOfBirth ? `${app.patientDateOfBirth}${ageStr ? ' ('+ageStr+')' : ''}` : null)}
        </div>

        <div class="appt-section-title"><i class="fas fa-calendar-check"></i> Appointment Information</div>
        <div class="appt-fields-grid">
            ${fieldRow('calendar-day', 'Date',              app.appointmentDate)}
            ${fieldRow('clock',        'Time',              formatTime(app.appointmentTime))}
            ${fieldRow('hospital',     'Clinic',            app.clinicName)}
            ${fieldRow('map-marker',   'Address',           app.clinicAddress)}
            ${fieldRow('stethoscope',  'Type',              app.consultationType?.replace('_',' '))}
            ${fieldRow('comment-dots', 'Reason',            app.reasonForVisit)}
            ${fieldRow('file-medical-alt', 'Chief Complaint', app.chiefComplaint)}
        </div>

        ${(app.diagnosis || app.doctorNotes) ? `
        <div class="appt-section-title"><i class="fas fa-notes-medical"></i> Clinical Notes</div>
        <div class="appt-fields-grid">
            ${fieldRow('diagnoses',    'Diagnosis',    app.diagnosis)}
            ${fieldRow('sticky-note',  'Doctor Notes', app.doctorNotes)}
        </div>` : ''}

        ${(app.consultationFee || app.paymentStatus) ? `
        <div class="appt-section-title"><i class="fas fa-receipt"></i> Payment</div>
        <div class="appt-fields-grid">
            ${fieldRow('rupee-sign',   'Fee',            app.consultationFee ? '₹' + Number(app.consultationFee).toLocaleString('en-IN') : null)}
            ${fieldRow('credit-card',  'Payment Status', app.paymentStatus)}
        </div>` : ''}
    `;

    const actionsEl = document.getElementById('apptDetailModalActions');
    const appointmentId = app.appointmentId || app.id;
    let btnHtml = `<button class="btn btn-primary" onclick="window.location.href='app_updation.html?id=${appointmentId}'"><i class="fas fa-stethoscope"></i> Process Appointment</button>`;

    if (app.status === 'PENDING' || app.status === 'SCHEDULED') {
        btnHtml += `<button class="btn btn-success" onclick="openActionModal(${appointmentId},'CONFIRM');closeAppointmentModal()"><i class="fas fa-check"></i> Confirm</button>`;
        btnHtml += `<button class="btn btn-danger"  onclick="openActionModal(${appointmentId},'CANCEL');closeAppointmentModal()"><i class="fas fa-times"></i> Cancel</button>`;
    } else if (app.status === 'CONFIRMED' || app.status === 'IN_PROGRESS') {
        btnHtml += `<button class="btn btn-primary" onclick="openActionModal(${appointmentId},'COMPLETE');closeAppointmentModal()"><i class="fas fa-check-double"></i> Mark Completed</button>`;
        btnHtml += `<button class="btn btn-danger"  onclick="openActionModal(${appointmentId},'CANCEL');closeAppointmentModal()"><i class="fas fa-times"></i> Cancel</button>`;
    }

    actionsEl.innerHTML = btnHtml;
    modal.style.display = 'flex';
};

// ─────────────────────────────────────────────
//  Filters
// ─────────────────────────────────────────────
function initFilters() {
    const allCheckbox = document.getElementById('filter-all');
    const statusCheckboxes = document.querySelectorAll('.status-filter');
    const emCheckbox = document.getElementById('filter-emergency');

    allCheckbox.addEventListener('change', e => {
        if (e.target.checked) { statusCheckboxes.forEach(cb => cb.checked = false); }
        renderScheduleGrid();
    });

    statusCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            if (cb.checked) allCheckbox.checked = false;
            if (!Array.from(statusCheckboxes).some(c => c.checked)) allCheckbox.checked = true;
            renderScheduleGrid();
        });
    });

    emCheckbox.addEventListener('change', () => renderScheduleGrid());
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function formatTime(timeStr) {
    if (!timeStr) return '--:--';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        let hrs = parseInt(parts[0], 10);
        const mins = parts[1];
        const ampm = hrs >= 12 ? 'PM' : 'AM';
        hrs = hrs % 12 || 12;
        return `${hrs}:${mins} ${ampm}`;
    }
    return timeStr;
}

function timeToMinutes(timeStr) {
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function minutesToTime(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3500);
}

// ─────────────────────────────────────────────
//  Schedule Config Modal (unchanged logic)
// ─────────────────────────────────────────────
function openScheduleModalForDate(date) {
    if (doctorClinics.length === 0) {
        alert('You must add a Clinic first. Go to Clinics page to manage your clinics.');
        return;
    }

    const locSelect = document.getElementById('editLocationId');
    locSelect.innerHTML = '';
    doctorClinics.forEach(clinic => {
        const option = document.createElement('option');
        option.value = clinic.locationId;
        option.textContent = clinic.clinicName;
        locSelect.appendChild(option);
    });

    const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    const dayOfWeek = days[date.getDay()];
    const schedule = doctorSchedules.find(s => s.dayOfWeek === dayOfWeek);

    document.getElementById('editDayOfWeek').value = dayOfWeek;
    document.getElementById('scheduleModalDay').textContent = dayOfWeek;

    if (schedule) {
        document.getElementById('editScheduleId').value = schedule.scheduleId;
        document.getElementById('editLocationId').value = schedule.locationId;
        document.getElementById('editStartTime').value = schedule.startTime;
        document.getElementById('editEndTime').value = schedule.endTime;
        document.getElementById('editBreakStart').value = schedule.breakStartTime || '';
        document.getElementById('editBreakEnd').value = schedule.breakEndTime || '';
        document.getElementById('editSlotDuration').value = schedule.slotDuration || 30;
        document.getElementById('editIsActive').checked = schedule.active !== false;
        selectedDuration = schedule.slotDuration || 30;
        document.querySelectorAll('.duration-pills .pill').forEach(p => {
            p.classList.toggle('active', parseInt(p.dataset.duration) === selectedDuration);
        });
    } else {
        document.getElementById('editScheduleId').value = '';
        document.getElementById('editLocationId').value = doctorSchedules.length > 0 ? doctorSchedules[0].locationId : '';
        document.getElementById('editStartTime').value = '09:00';
        document.getElementById('editEndTime').value = '17:00';
        document.getElementById('editBreakStart').value = '';
        document.getElementById('editBreakEnd').value = '';
        document.getElementById('editSlotDuration').value = 30;
        document.getElementById('editIsActive').checked = true;
        selectedDuration = 30;
        document.querySelectorAll('.duration-pills .pill').forEach(p => {
            p.classList.toggle('active', parseInt(p.dataset.duration) === 30);
        });
    }

    updateSlotPreview();
    document.getElementById('scheduleModal').style.display = 'flex';
}

// ─────────────────────────────────────────────
//  Duration Pills & Slot Preview
// ─────────────────────────────────────────────
function initDurationPills() {
    document.querySelectorAll('.duration-pills .pill').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.duration-pills .pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            selectedDuration = parseInt(this.dataset.duration);
            document.getElementById('editSlotDuration').value = selectedDuration;
            updateSlotPreview();
        });
    });
}

function initSlotPreview() {
    ['editStartTime','editEndTime','editBreakStart','editBreakEnd'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateSlotPreview);
    });
}

function updateSlotPreview() {
    const container = document.getElementById('slotPreview');
    if (!container) return;

    const startTime = document.getElementById('editStartTime').value;
    const endTime   = document.getElementById('editEndTime').value;
    const breakStart = document.getElementById('editBreakStart').value;
    const breakEnd   = document.getElementById('editBreakEnd').value;
    const duration   = parseInt(document.getElementById('editSlotDuration').value) || 30;

    if (!startTime || !endTime) {
        container.innerHTML = '<p class="text-muted text-sm">Set start &amp; end time to see preview...</p>';
        return;
    }

    let current = timeToMinutes(startTime);
    const end   = timeToMinutes(endTime);
    const bStart = breakStart ? timeToMinutes(breakStart) : null;
    const bEnd   = breakEnd   ? timeToMinutes(breakEnd)   : null;

    if (current >= end) {
        container.innerHTML = '<p class="text-muted text-sm" style="color:var(--danger);">End time must be after start time.</p>';
        return;
    }

    let html = '';
    let count = 0;
    while (current + duration <= end) {
        const isBreak = bStart !== null && bEnd !== null && current >= bStart && current < bEnd;
        const timeStr = minutesToTime(current);
        if (isBreak) {
            html += `<span class="preview-slot break"><i class="fas fa-mug-hot"></i> ${timeStr}</span>`;
        } else {
            html += `<span class="preview-slot available">${timeStr}</span>`;
            count++;
        }
        current += duration;
    }

    container.innerHTML = `<div class="preview-count">${count} available slots</div>` + html;
}

// ─────────────────────────────────────────────
//  Action Modal (Confirm / Cancel / Complete)
// ─────────────────────────────────────────────
const modal = document.getElementById('actionModal');
const scheduleModal = document.getElementById('scheduleModal');

function initModal() {
    document.querySelectorAll('.close, .close-btn').forEach(b => b.onclick = () => modal.style.display = 'none');
    document.querySelectorAll('.close-schedule-btn').forEach(b => b.onclick = () => scheduleModal.style.display = 'none');

    window.addEventListener('click', e => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === scheduleModal) scheduleModal.style.display = 'none';
    });

    document.getElementById('confirmActionBtn').onclick = executeAction;
    document.getElementById('saveScheduleBtn').onclick = saveScheduleRules;
}

function openActionModal(id, type) {
    document.getElementById('actionApptId').value = id;
    document.getElementById('actionType').value = type;

    const config = {
        CONFIRM:  { title: 'Confirm Appointment',  text: 'Confirm this appointment and notify the patient?', cls: 'btn-success' },
        CANCEL:   { title: 'Cancel Appointment',   text: 'Are you sure you want to cancel? This cannot be undone.', cls: 'btn-danger' },
        COMPLETE: { title: 'Complete Appointment', text: 'Mark this appointment as completed?', cls: 'btn-primary' }
    };
    const c = config[type] || { title: 'Update Appointment', text: 'Proceed?', cls: 'btn-primary' };

    document.getElementById('actionModalTitle').textContent = c.title;
    document.getElementById('actionModalText').textContent  = c.text;
    const btn = document.getElementById('confirmActionBtn');
    btn.className = `btn ${c.cls}`;
    btn.textContent = 'Yes, Proceed';
    modal.style.display = 'flex';
}

async function executeAction() {
    const id     = document.getElementById('actionApptId').value;
    const type   = document.getElementById('actionType').value;
    const token  = localStorage.getItem('token');
    const statusMap = { CONFIRM: 'CONFIRMED', CANCEL: 'CANCELLED', COMPLETE: 'COMPLETED' };
    const status = statusMap[type] || type;

    try {
        const response = await fetch(`/api/appointments/${id}/status?status=${status}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error(await response.text() || 'Action failed');
        modal.style.display = 'none';
        refreshSchedule();
        showToast('Appointment updated successfully.', 'success');
    } catch (e) {
        showToast(e.message, 'error');
        console.error(e);
    }
}

async function saveScheduleRules(e) {
    e.preventDefault();
    const token     = localStorage.getItem('token');
    const scheduleId = document.getElementById('editScheduleId').value;
    const isNew     = !scheduleId;
    const url       = isNew ? '/api/doctors/schedules' : `/api/doctors/schedules/${scheduleId}`;
    const method    = isNew ? 'POST' : 'PUT';

    const payload = {
        locationId:    document.getElementById('editLocationId').value,
        dayOfWeek:     document.getElementById('editDayOfWeek').value,
        startTime:     document.getElementById('editStartTime').value,
        endTime:       document.getElementById('editEndTime').value,
        breakStartTime: document.getElementById('editBreakStart').value || null,
        breakEndTime:   document.getElementById('editBreakEnd').value || null,
        slotDuration:  document.getElementById('editSlotDuration').value,
        active:        document.getElementById('editIsActive').checked
    };

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(await response.text() || 'Failed to update schedule');
        scheduleModal.style.display = 'none';
        // Re-fetch schedules and re-render working hours after save
        const schedRes = await fetch('/api/doctors/schedules', { headers: { 'Authorization': `Bearer ${token}` } });
        if (schedRes.ok) doctorSchedules = await schedRes.json();
        renderScheduleRules();
        refreshSchedule();
        showToast('Schedule updated successfully.', 'success');
    } catch (err) {
        showToast(err.message, 'error');
        console.error(err);
    }
}
