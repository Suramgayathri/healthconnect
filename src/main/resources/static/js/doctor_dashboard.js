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

    updateClock();
    setInterval(updateClock, 1000);

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString(undefined, options);

    fetchDashboardData(token);
});

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

async function fetchDashboardData(token) {
    try {
        const response = await fetch('/api/appointments/doctor/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Failed to load dashboard data");
        }

        const appointments = await response.json();

        // Mock doctor name if empty API response or extract from token (JWT decode skipped for simplicity, using generic if absent)
        document.getElementById('welcomeText').textContent = "Welcome back, Doctor!";

        processDashboard(appointments);

    } catch (error) {
        console.error("Dashboard error:", error);
        document.getElementById('loader').innerHTML = `<p class="text-danger flex items-center gap-2"><i class="fas fa-exclamation-triangle"></i> Error loading dashboard.</p>`;
    }
}

function processDashboard(data) {
    const todayStr = new Date().toISOString().split('T')[0];
    let todayAppointments = [];

    // Some backend APIs return { content: [...] } for pagination
    const apps = data.content || data;

    if (Array.isArray(apps)) {
        todayAppointments = apps.filter(app => {
            if (!app.appointmentDate) return false;
            return app.appointmentDate.split('T')[0] === todayStr;
        });
    }

    // Sorting by time
    todayAppointments.sort((a, b) => {
        const timeA = a.appointmentTime || "00:00:00";
        const timeB = b.appointmentTime || "00:00:00";
        return timeA.localeCompare(timeB);
    });

    let completed = 0;
    let pending = 0;
    let emergency = 0;
    let emergenciesList = [];

    todayAppointments.forEach(app => {
        if (app.status === 'COMPLETED') completed++;
        if (app.status === 'PENDING' || app.status === 'CONFIRMED') pending++;

        // Checking if triage flag or emergency field exists
        const isEmergency = app.isEmergency === true || (app.priority && app.priority.toLowerCase() === 'high');
        if (isEmergency) {
            emergency++;
            if (app.status !== 'COMPLETED' && app.status !== 'CANCELLED') {
                emergenciesList.push(app);
            }
        }
    });

    document.getElementById('statToday').textContent = todayAppointments.length;
    document.getElementById('statCompleted').textContent = completed;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statEmergency').textContent = emergency;

    renderEmergencyAlerts(emergenciesList);
    renderTimeline(todayAppointments);
}

function renderEmergencyAlerts(emergencies) {
    const alertsContainer = document.getElementById('emergencyAlerts');
    if (emergencies.length > 0) {
        let html = `<h3><i class="fas fa-exclamation-triangle"></i> ${emergencies.length} Emergency Alert(s)</h3>`;
        emergencies.forEach(app => {
            const timeStr = formatTime(app.appointmentTime);
            html += `
                <div class="alert-item">
                    <div>
                        <strong>${app.patientName || app.patient?.name || 'Patient'}</strong> - ${app.reason || 'Emergency Priority'}
                    </div>
                    <div style="color:var(--danger); font-weight:bold;">${timeStr}</div>
                </div>
            `;
        });
        alertsContainer.innerHTML = html;
        alertsContainer.classList.remove('hidden');
    } else {
        alertsContainer.classList.add('hidden');
    }
}

function renderTimeline(appointments) {
    document.getElementById('loader').classList.add('hidden');
    const timeline = document.getElementById('queueList');
    const noAppts = document.getElementById('noAppointments');

    if (appointments.length === 0) {
        noAppts.classList.remove('hidden');
        timeline.innerHTML = '';
        return;
    }

    noAppts.classList.add('hidden');
    let html = '';

    appointments.forEach(app => {
        const isEmergency = app.isEmergency === true || (app.priority && app.priority.toLowerCase() === 'high');
        const isCompleted = app.status === 'COMPLETED';
        let itemClass = '';
        let badge = '';

        if (isEmergency && !isCompleted) itemClass = 'emergency';
        else if (isCompleted) itemClass = 'completed';

        if (isCompleted) badge = `<span class="badge" style="background:var(--secondary-light); color:var(--secondary); padding: 2px 8px; border-radius:12px; font-size: 0.75rem;">Done</span>`;
        if (isEmergency && !isCompleted) badge = `<span class="badge" style="background:var(--danger); color:white; padding: 2px 8px; border-radius:12px; font-size: 0.75rem;"><i class="fas fa-bolt"></i> Urgent</span>`;

        html += `
            <div class="queue-item ${itemClass}">
                <div class="item-content">
                    <div class="item-header">
                        <span class="item-time"><i class="far fa-clock"></i> ${formatTime(app.appointmentTime)}</span>
                        ${badge}
                    </div>
                    <div class="item-patient">${app.patientName || app.patient?.name || 'Unknown Patient'}</div>
                    <div class="item-reason">${app.reason || 'General Checkup'}</div>
                </div>
            </div>
        `;
    });

    timeline.innerHTML = html;
}

function formatTime(timeStr) {
    if (!timeStr) return '--:--';
    // Handle HH:mm:ss to HH:mm AM/PM
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

function refreshData() {
    const token = localStorage.getItem('token');
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('queueList').innerHTML = '';
    fetchDashboardData(token);
}
