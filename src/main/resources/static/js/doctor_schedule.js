let allAppointments = [];
let doctorSchedules = [];
let doctorClinics = [];
let allSlots = [];
let currentDisplayDate = new Date();

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    initFilters();
    initModal();
    initGridNavigation();
    fetchAndRenderSchedule(token);
});

function initGridNavigation() {
    document.getElementById('prevDayBtn').addEventListener('click', () => {
        currentDisplayDate.setDate(currentDisplayDate.getDate() - 1);
        refreshSchedule();
    });
    document.getElementById('nextDayBtn').addEventListener('click', () => {
        currentDisplayDate.setDate(currentDisplayDate.getDate() + 1);
        refreshSchedule();
    });
}

async function fetchAndRenderSchedule(token) {
    document.getElementById('calendar-loader').style.display = 'flex';

    try {
        const [appRes, schedRes, clinicRes, profileRes] = await Promise.all([
            fetch('/api/doctors/appointments?size=100', { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('/api/doctors/schedules', { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('/api/doctors/me/clinics', { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('/api/doctors/profile', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!appRes.ok) throw new Error("Failed to load appointments");
        if (!schedRes.ok) throw new Error("Failed to load schedules");
        if (!clinicRes.ok) throw new Error("Failed to load clinics");
        if (!profileRes.ok) throw new Error("Failed to load profile");

        const appData = await appRes.json();
        allAppointments = appData.content || appData;
        
        const schedData = await schedRes.json();
        doctorSchedules = schedData || [];

        const clinicData = await clinicRes.json();
        doctorClinics = clinicData || [];

        const profileData = await profileRes.json();
        const doctorId = profileData.doctorId;

        // Fetch slots for current grid date only
        allSlots = [];
        if (doctorId && doctorClinics.length > 0) {
            const dateStr = currentDisplayDate.toISOString().split('T')[0];
            
            const slotPromises = [];
            doctorClinics.forEach(c => {
                slotPromises.push(
                    fetch(`/api/appointments/slots?doctorId=${doctorId}&locationId=${c.locationId}&date=${dateStr}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    .then(r => r.ok ? r.json() : [])
                );
            });
            
            const slotResults = await Promise.all(slotPromises);
            slotResults.forEach(resArray => {
                if (Array.isArray(resArray)) {
                    allSlots = allSlots.concat(resArray);
                }
            });
        }

        renderScheduleRules();
        renderScheduleGrid();
    } catch (e) {
        console.error(e);
        alert('Could not load appointments or schedules.');
    } finally {
        document.getElementById('calendar-loader').style.display = 'none';
    }
}

function initFilters() {
    const defaultFilters = ['PENDING', 'CONFIRMED', 'COMPLETED'];

    const allCheckbox = document.getElementById('filter-all');
    const statusCheckboxes = document.querySelectorAll('.status-filter');
    const emCheckbox = document.getElementById('filter-emergency');

    allCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            statusCheckboxes.forEach(cb => cb.checked = false);
            updateCalendarEvents();
        }
    });

    statusCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            if (cb.checked) allCheckbox.checked = false;

            // If all are unchecked, check 'All'
            const anyChecked = Array.from(statusCheckboxes).some(c => c.checked);
            if (!anyChecked) allCheckbox.checked = true;

            updateCalendarEvents();
        });
    });

    emCheckbox.addEventListener('change', () => renderScheduleGrid());
}

function renderScheduleGrid() {
    const gridEl = document.getElementById('slotsGrid');
    if (!gridEl) return;
    
    const displayDateStr = currentDisplayDate.toISOString().split('T')[0];
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormatted = currentDisplayDate.toLocaleDateString(undefined, options);
    
    document.getElementById('currentGridDate').textContent = dateFormatted;
    document.getElementById('addSlotBtnDate').textContent = dateFormatted;
    
    let html = '';
    
    // First, isolate appointments strictly to the requested day
    const dayAppointments = allAppointments.filter(app => app.appointmentDate && app.appointmentDate.split('T')[0] === displayDateStr);

    const allChecked = document.getElementById('filter-all').checked;
    const activeStatuses = Array.from(document.querySelectorAll('.status-filter')).filter(cb => cb.checked).map(cb => cb.value);
    const emChecked = document.getElementById('filter-emergency').checked;

    let blocks = [];
    
    // Add Break Block
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const currentDayOfWeek = days[currentDisplayDate.getDay()];
    const activeSchedule = doctorSchedules.find(s => s.dayOfWeek === currentDayOfWeek);
    
    if (activeSchedule && activeSchedule.breakStartTime) {
        blocks.push({
            type: 'BREAK',
            time: activeSchedule.breakStartTime,
            endTime: activeSchedule.breakEndTime
        });
    }
    
    // Add open slots
    if (allChecked || activeStatuses.length > 0) {
        allSlots.forEach(slot => {
            if (slot.isAvailable || slot.available) {
                blocks.push({ type: 'SLOT', time: slot.startTime, ...slot });
            }
        });
    }

    // Add Appointments
    dayAppointments.forEach(app => {
        if (!allChecked && !activeStatuses.includes(app.status)) return;
        const isEmergency = app.isEmergency === true || (app.priority && app.priority.toLowerCase() === 'high');
        if (emChecked && !isEmergency) return;
        
        blocks.push({ type: 'APPOINTMENT', time: app.appointmentTime || '00:00:00', ...app, isEmergency });
    });

    // Chronological order
    blocks.sort((a,b) => a.time.localeCompare(b.time));

    if (blocks.length === 0) {
        gridEl.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #6b7280;"><i class="fas fa-calendar-times" style="font-size: 2rem; margin-bottom: 1rem;"></i><br>No available slots or appointments found for this date.</div>';
        return;
    }

    blocks.forEach(b => {
        if (b.type === 'BREAK') {
            html += `
                <div class="slot-box" style="background:#fef3c7; border-color:#f59e0b; justify-content:center; align-items:center; text-align:center;">
                    <div style="color:#b45309;">
                        <i class="fas fa-mug-hot" style="font-size:1.5rem; margin-bottom:0.5rem;"></i><br>
                        <strong>Break Time</strong><br>
                        <small>${formatTime(b.time)} - ${formatTime(b.endTime)}</small>
                    </div>
                </div>
            `;
        } else if (b.type === 'SLOT') {
            html += `
                <div class="slot-box available" onclick="openScheduleModalForDate(currentDisplayDate)">
                    <div class="slot-time">
                        <span><i class="far fa-clock"></i> ${formatTime(b.startTime)}</span>
                    </div>
                    <div class="slot-patient">Available Open Slot</div>
                    <div class="slot-status" style="background:#bbf7d0; color:#15803d;">Can Be Booked</div>
                </div>
            `;
        } else {
            let boxClass = 'booked';
            let statusBadgeColor = '#e0e7ff';
            let statusTextColor = 'var(--primary)';
            
            if (b.isEmergency && b.status !== 'COMPLETED') {
                boxClass = 'emergency';
                statusBadgeColor = '#fecaca';
                statusTextColor = '#b91c1c';
            } else if (b.status === 'COMPLETED') {
                statusBadgeColor = '#dcfce3';
                statusTextColor = '#15803d';
            } else if (b.status === 'PENDING') {
                statusBadgeColor = '#fef3c7';
                statusTextColor = '#b45309';
            }

            html += `
                <div class="slot-box ${boxClass}" onclick='handleBlockClick(${JSON.stringify(b).replace(/'/g, "&apos;")})'>
                    <div class="slot-time">
                        <span><i class="far fa-clock"></i> ${formatTime(b.time)}</span>
                        ${b.isEmergency ? '<i class="fas fa-exclamation-circle text-danger" title="Emergency"></i>' : ''}
                    </div>
                    <div class="slot-patient">${b.patientName || b.patient?.name || 'Unknown Patient'}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; word-break: break-all;">${b.reasonForVisit || 'General'}</div>
                    <div class="slot-status" style="background:${statusBadgeColor}; color:${statusTextColor};">${b.status}</div>
                </div>
            `;
        }
    });

    gridEl.innerHTML = html;
}

window.handleBlockClick = function(app) {
    showAppointmentDetails(app, app.appointmentId || app.id);
};

function formatTime(timeStr) {
    if (!timeStr) return '--:--';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        let hrs = parseInt(parts[0], 10);
        const mins = parts[1];
        const ampm = hrs >= 12 ? 'PM' : 'AM';
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12;
        return `${hrs}:${mins} ${ampm}`;
    }
    return timeStr;
}

function renderScheduleRules() {
    const container = document.getElementById('schedule-rules-list');
    if (!container) return;
    
    if (doctorSchedules.length === 0) {
        container.innerHTML = '<p class="text-muted" style="font-size: 0.9rem;">No working hours set. Click any day on the calendar to configure your schedule.</p>';
        return;
    }
    
    let html = '';
    
    // Sort schedules by Day Of Week natively if possible, or just print them.
    const weekOrder = { 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3, 'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6, 'SUNDAY': 7 };
    doctorSchedules.sort((a,b) => (weekOrder[a.dayOfWeek] || 99) - (weekOrder[b.dayOfWeek] || 99));

    doctorSchedules.forEach(schedule => {
        const clinic = doctorClinics.find(c => c.locationId === schedule.locationId);
        const clinicName = clinic ? clinic.clinicName : 'Unknown Clinic';
        
        html += `
            <div style="padding: 12px; border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 8px; background: #fff;">
                <div style="font-weight: 600; color: var(--dark); margin-bottom: 4px;">${schedule.dayOfWeek}</div>
                <div style="font-size: 0.85rem; color: var(--primary); margin-bottom: 4px;">
                    <i class="fas fa-map-marker-alt"></i> ${clinicName}
                </div>
                <div style="font-size: 0.85rem; color: #4B5563;">
                    <i class="far fa-clock"></i> ${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}
                </div>
                ${schedule.breakStartTime ? `
                <div style="font-size: 0.8rem; color: var(--warning); margin-top: 4px;">
                    <i class="fas fa-mug-hot"></i> Break: ${formatTime(schedule.breakStartTime)} - ${formatTime(schedule.breakEndTime)}
                </div>` : ''}
            </div>
        `;
    });
    container.innerHTML = html;
}

function openScheduleModalForDate(date) {
    if (doctorClinics.length === 0) {
        alert("You must add a Clinic on your Dashboard before creating a schedule. Please go to Dashboard -> Clinic Management.");
        return;
    }

    // Populate Clinic Dropdown
    const locSelect = document.getElementById('editLocationId');
    locSelect.innerHTML = '';
    doctorClinics.forEach(clinic => {
        const option = document.createElement('option');
        option.value = clinic.locationId;
        option.textContent = `${clinic.clinicName} - ${clinic.address}`;
        locSelect.appendChild(option);
    });

    // Determine the day of the week (e.g., MONDAY, TUESDAY) from the clicked date
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayOfWeek = days[date.getDay()];
    
    // Find if there's an existing schedule template for this day
    const schedule = doctorSchedules.find(s => s.dayOfWeek === dayOfWeek);
    
    document.getElementById('editDayOfWeek').value = dayOfWeek;
    
    if (schedule) {
        // Edit existing
        document.getElementById('editScheduleId').value = schedule.scheduleId;
        document.getElementById('editLocationId').value = schedule.locationId;
        document.getElementById('editStartTime').value = schedule.startTime;
        document.getElementById('editEndTime').value = schedule.endTime;
        document.getElementById('editBreakStart').value = schedule.breakStartTime || '';
        document.getElementById('editBreakEnd').value = schedule.breakEndTime || '';
        document.getElementById('editSlotDuration').value = schedule.slotDuration || 30;
        document.getElementById('editIsActive').checked = schedule.active !== false;
    } else {
        // Creating new schedule
        document.getElementById('editScheduleId').value = '';
        // If there's an existing schedule, default to its location, else leave empty so user can select
        const defaultLocId = doctorSchedules.length > 0 ? doctorSchedules[0].locationId : '';
        document.getElementById('editLocationId').value = defaultLocId;
        document.getElementById('editStartTime').value = '09:00:00';
        document.getElementById('editEndTime').value = '17:00:00';
        document.getElementById('editBreakStart').value = '';
        document.getElementById('editBreakEnd').value = '';
        document.getElementById('editSlotDuration').value = 30;
        document.getElementById('editIsActive').checked = true;
    }

    const scheduleModal = document.getElementById('scheduleModal');
    scheduleModal.style.display = 'flex';
}

function showAppointmentDetails(app, id) {
    const card = document.getElementById('appointment-details-card');
    const content = document.getElementById('details-content');
    const actions = document.getElementById('details-actions');

    const statusBadgeColors = {
        'PENDING': 'var(--warning)',
        'CONFIRMED': 'var(--secondary)',
        'COMPLETED': 'var(--primary)',
        'CANCELLED': 'var(--danger)',
        'SCHEDULED': 'var(--warning)',
        'IN_PROGRESS': '#F59E0B',
        'NO_SHOW': 'gray'
    };
    const c = statusBadgeColors[app.status] || 'gray';

    content.innerHTML = `
        <div class="details-item">
            <label>Patient</label>
            <div>${app.patientName || app.patient?.name || 'Unknown'} ${app.isEmergency ? '<i class="fas fa-exclamation-circle text-danger"></i>' : ''}</div>
        </div>
        <div class="details-item">
            <label>Time</label>
            <div>${app.appointmentDate?.split('T')[0]} @ ${app.appointmentTime || '--:--'}</div>
        </div>
        <div class="details-item">
            <label>Status</label>
            <div style="color:${c}; font-weight:bold;">${app.status}</div>
        </div>
        <div class="details-item">
            <label>Reason</label>
            <div>${app.reasonForVisit || app.reason || app.chiefComplaint || 'Not provided'}</div>
        </div>
    `;

    // Use appointmentId if id is undefined
    const appointmentId = id || app.appointmentId || app.id;

    // actions
    let btnHtml = `<button class="btn btn-primary w-100 mb-2" onclick="window.location.href='app_updation.html?id=${appointmentId}'"><i class="fas fa-stethoscope"></i> Process Appointment</button>`;
    if (app.status === 'PENDING' || app.status === 'SCHEDULED') {
        btnHtml += `<button class="btn btn-success" onclick="openActionModal(${appointmentId}, 'CONFIRM')">Confirm</button>`;
        btnHtml += `<button class="btn btn-outline-danger" onclick="openActionModal(${appointmentId}, 'CANCEL')">Cancel</button>`;
    } else if (app.status === 'CONFIRMED' || app.status === 'IN_PROGRESS') {
        btnHtml += `<button class="btn btn-primary" onclick="openActionModal(${appointmentId}, 'COMPLETE')">Mark Completed</button>`;
        btnHtml += `<button class="btn btn-outline-danger" onclick="openActionModal(${appointmentId}, 'CANCEL')">Cancel</button>`;
    } else {
        btnHtml += `<p class="text-muted text-sm">No other actions available.</p>`;
    }
    actions.innerHTML = btnHtml;

    card.style.display = 'block';
}

function refreshSchedule() {
    fetchAndRenderSchedule(localStorage.getItem('token'));
    document.getElementById('appointment-details-card').style.display = 'none';
}

// Modal Logic
const modal = document.getElementById('actionModal');
const scheduleModal = document.getElementById('scheduleModal');
const closeBtns = document.querySelectorAll('.close, .close-btn');
const closeScheduleBtns = document.querySelectorAll('.close-schedule-btn');

function initModal() {
    closeBtns.forEach(b => b.onclick = () => modal.style.display = 'none');
    closeScheduleBtns.forEach(b => b.onclick = () => scheduleModal.style.display = 'none');
    
    window.onclick = e => { 
        if (e.target == modal) modal.style.display = 'none'; 
        if (e.target == scheduleModal) scheduleModal.style.display = 'none';
    };
    
    document.getElementById('confirmActionBtn').onclick = executeAction;
    document.getElementById('saveScheduleBtn').onclick = saveScheduleRules;
}

async function saveScheduleRules(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const scheduleId = document.getElementById('editScheduleId').value;
    const isNew = !scheduleId;
    const url = isNew ? `/api/doctors/schedules` : `/api/doctors/schedules/${scheduleId}`;
    const method = isNew ? 'POST' : 'PUT';

    const payload = {
        locationId: document.getElementById('editLocationId').value,
        dayOfWeek: document.getElementById('editDayOfWeek').value,
        startTime: document.getElementById('editStartTime').value,
        endTime: document.getElementById('editEndTime').value,
        breakStartTime: document.getElementById('editBreakStart').value || null,
        breakEndTime: document.getElementById('editBreakEnd').value || null,
        slotDuration: document.getElementById('editSlotDuration').value,
        active: document.getElementById('editIsActive').checked
    };

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to update schedule");
        }

        scheduleModal.style.display = 'none';
        refreshSchedule(); // Reloads both schedules and appointments
        alert('Schedule updated successfully. Affected appointments have been cancelled and patients notified.');
    } catch (err) {
        alert(err.message);
        console.error('Error saving schedule:', err);
    }
}

function openActionModal(id, type) {
    document.getElementById('actionApptId').value = id;
    document.getElementById('actionType').value = type;

    let title = 'Update Appointment';
    let text = 'Proceed with updating this appointment?';
    let btnClass = 'btn-primary';

    if (type === 'CONFIRM') { title = 'Confirm Appointment'; text = 'Confirm this appointment and notify the patient?'; btnClass = 'btn-success'; }
    if (type === 'CANCEL') { title = 'Cancel Appointment'; text = 'Are you sure you want to cancel? This cannot be undone.'; btnClass = 'btn-danger'; }
    if (type === 'COMPLETE') { title = 'Complete Appointment'; text = 'Mark this appointment as completed?'; btnClass = 'btn-primary'; }

    document.getElementById('actionModalTitle').textContent = title;
    document.getElementById('actionModalText').textContent = text;

    const confirmBtn = document.getElementById('confirmActionBtn');
    confirmBtn.className = `btn ${btnClass}`;
    confirmBtn.textContent = 'Yes, Proceed';

    modal.style.display = 'flex';
}

async function executeAction() {
    const id = document.getElementById('actionApptId').value;
    const type = document.getElementById('actionType').value;
    const token = localStorage.getItem('token');

    // Map action types to status values
    const statusMap = {
        'CONFIRM': 'CONFIRMED',
        'CANCEL': 'CANCELLED',
        'COMPLETE': 'COMPLETED'
    };

    const status = statusMap[type] || type;
    const endpoint = `/api/appointments/${id}/status?status=${status}`;

    try {
        const payload = { status: status };
        
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Action failed");
        }

        modal.style.display = 'none';
        refreshSchedule();
    } catch (e) {
        alert(e.message);
        console.error('Error executing action:', e);
    }
}
