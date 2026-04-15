document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('doctorPublicId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    });

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString(undefined, options);

    fetchDashboardData(token);
});

async function fetchDashboardData(token) {
    try {
        const response = await fetch('/api/doctors/dashboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Failed to load dashboard data");
        }

        const dashboardData = await response.json();
        
        document.getElementById('welcomeText').textContent = "Welcome back, Doctor!";

        processDashboard(dashboardData);

    } catch (error) {
        console.error("Dashboard error:", error);
        document.getElementById('loader').innerHTML = `<p class="text-danger flex items-center gap-2"><i class="fas fa-exclamation-triangle"></i> Error loading dashboard.</p>`;
    }
}

function processDashboard(data) {
    const metrics = data.metrics || {};
    
    document.getElementById('statToday').textContent = metrics.todayAppointments || 0;
    document.getElementById('statCompleted').textContent = metrics.completedAppointments || 0;
    document.getElementById('statPending').textContent = metrics.pendingAppointments || 0;
    document.getElementById('statEmergency').textContent = (data.emergencyAppointments ? data.emergencyAppointments.length : 0);

    renderEmergencyAlerts(data.emergencyAppointments || []);
    renderTimeline(data.todayAppointments || []);
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
            <div class="queue-item ${itemClass}" onclick="window.location.href='app_updation.html?id=${app.appointmentId}'" style="cursor: pointer;">
                <div class="item-content">
                    <div class="item-header">
                        <span class="item-time"><i class="far fa-clock"></i> ${formatTime(app.appointmentTime)}</span>
                        ${badge}
                    </div>
                    <div class="item-patient">${app.patientName || 'Unknown Patient'}</div>
                    <div class="item-reason">${app.reasonForVisit || 'General Checkup'}</div>
                </div>
            </div>
        `;
    });

    timeline.innerHTML = html;
}

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
