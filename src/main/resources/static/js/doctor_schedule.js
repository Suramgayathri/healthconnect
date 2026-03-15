let calendar;
let allAppointments = [];

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
    fetchAndRenderSchedule(token);
});

async function fetchAndRenderSchedule(token) {
    document.getElementById('calendar-loader').style.display = 'block';
    if (calendar) {
        document.getElementById('calendar').innerHTML = ''; // Clear existing
    }

    try {
        const response = await fetch('/api/appointments/doctor/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to load schedule");

        const data = await response.json();
        allAppointments = data.content || data; // handle pagination structure if any

        renderCalendar();
    } catch (e) {
        console.error(e);
        alert('Could not load appointments.');
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

    emCheckbox.addEventListener('change', () => updateCalendarEvents());
}

function updateCalendarEvents() {
    if (!calendar) return;
    calendar.removeAllEvents();
    calendar.addEventSource(getFilteredEvents());
}

function getFilteredEvents() {
    const allChecked = document.getElementById('filter-all').checked;
    const statusCheckboxes = document.querySelectorAll('.status-filter');
    const activeStatuses = Array.from(statusCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const emChecked = document.getElementById('filter-emergency').checked;

    const events = [];

    allAppointments.forEach(app => {
        if (!app.appointmentDate) return;

        // Apply filters
        if (!allChecked && !activeStatuses.includes(app.status)) return;

        const isEmergency = app.isEmergency === true || (app.priority && app.priority.toLowerCase() === 'high');
        if (emChecked && !isEmergency) return;

        // Map to FullCalendar Event Format
        const dateStr = app.appointmentDate.split('T')[0];
        const timeStr = app.appointmentTime || "00:00:00";
        const startDateTime = `${dateStr}T${timeStr}`;

        let color = '#4F46E5'; // primary (Completed/Default)
        if (app.status === 'PENDING') color = '#F59E0B'; // warning
        if (app.status === 'CONFIRMED') color = '#10B981'; // success
        if (isEmergency && app.status !== 'COMPLETED') color = '#EF4444'; // danger overrides

        events.push({
            id: app.id,
            title: `${app.patientName || app.patient?.name || 'Patient'} ${isEmergency ? '(URGENT)' : ''}`,
            start: startDateTime,
            backgroundColor: color,
            borderColor: color,
            extendedProps: { ...app, isEmergency }
        });
    });

    return events;
}

function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        allDaySlot: false,
        events: getFilteredEvents(),
        eventClick: function (info) {
            showAppointmentDetails(info.event.extendedProps, info.event.id);
        }
    });
    calendar.render();
}

function showAppointmentDetails(app, id) {
    const card = document.getElementById('appointment-details-card');
    const content = document.getElementById('details-content');
    const actions = document.getElementById('details-actions');

    const statusBadgeColors = {
        'PENDING': 'var(--warning)',
        'CONFIRMED': 'var(--secondary)',
        'COMPLETED': 'var(--primary)',
        'CANCELLED': 'var(--danger)'
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
            <div>${app.reason || 'Not provided'}</div>
        </div>
    `;

    // actions
    let btnHtml = '';
    if (app.status === 'PENDING') {
        btnHtml += `<button class="btn btn-success" onclick="openActionModal(${id}, 'CONFIRM')">Confirm</button>`;
        btnHtml += `<button class="btn btn-outline-danger" onclick="openActionModal(${id}, 'CANCEL')">Cancel</button>`;
    } else if (app.status === 'CONFIRMED') {
        btnHtml += `<button class="btn btn-primary" onclick="openActionModal(${id}, 'COMPLETE')">Mark Completed</button>`;
        btnHtml += `<button class="btn btn-outline-danger" onclick="openActionModal(${id}, 'CANCEL')">Cancel</button>`;
    } else {
        btnHtml += `<p class="text-muted text-sm">No actions available.</p>`;
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
const closeBtns = document.querySelectorAll('.close, .close-btn');

function initModal() {
    closeBtns.forEach(b => b.onclick = () => modal.style.display = 'none');
    window.onclick = e => { if (e.target == modal) modal.style.display = 'none'; }
    document.getElementById('confirmActionBtn').onclick = executeAction;
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

    let endpoint = `/api/appointments/${id}/${type.toLowerCase()}`;
    // E.g. /api/appointments/1/confirm, /cancel, /complete (assuming these map to backend endpoints correctly)

    try {
        const response = await fetch(endpoint, {
            method: 'POST', // or PUT depending on backend
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Action failed");

        modal.style.display = 'none';
        refreshSchedule();
    } catch (e) {
        alert(e.message);
    }
}
