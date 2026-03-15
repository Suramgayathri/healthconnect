// Patient Dashboard - HealthConnect
const API_BASE = 'http://localhost:8080';

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Auth headers
function authHeaders() {
    return {
        'Authorization': 'Bearer ' + getToken(),
        'Content-Type': 'application/json'
    };
}

// Check authentication
function checkAuth() {
    const token = getToken();
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'PATIENT') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Load user profile
async function loadUserProfile() {
    try {
        const response = await fetch(`${API_BASE}/api/auth/profile`, {
            headers: authHeaders()
        });
        
        if (response.ok) {
            const profile = await response.json();
            
            // Update user name in navbar
            const fullName = profile.fullName || 'Patient';
            document.getElementById('userName').textContent = fullName;
            document.getElementById('welcomeName').textContent = fullName;
            
            // Update user initial
            const initial = fullName.charAt(0).toUpperCase();
            document.getElementById('userInitial').textContent = initial;
            
            // Update health snapshot
            updateHealthSnapshot(profile);
            
            return profile;
        } else {
            console.error('Failed to load profile');
            // Fallback to email
            const email = localStorage.getItem('userEmail') || 'Patient';
            document.getElementById('userName').textContent = email;
            document.getElementById('welcomeName').textContent = email.split('@')[0];
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Update health snapshot section
function updateHealthSnapshot(profile) {
    const healthItems = document.querySelectorAll('.health-item');
    
    if (healthItems.length >= 1) {
        const bloodGroup = profile.bloodGroup || 'Not specified';
        healthItems[0].querySelector('.health-value').textContent = bloodGroup;
    }
    
    if (healthItems.length >= 2) {
        // Allergies - you can add this field to patient profile later
        const allergies = profile.allergies || 'None reported';
        healthItems[1].querySelector('.health-value').textContent = allergies;
    }
    
    if (healthItems.length >= 3) {
        const phone = profile.phone || 'Not provided';
        healthItems[2].querySelector('.health-value').textContent = phone;
        
        // Update emergency contact if available
        const emergencyContact = profile.emergencyContact || profile.fullName;
        const subtext = healthItems[2].querySelector('.health-subtext');
        if (subtext) {
            subtext.textContent = `(${emergencyContact})`;
        }
    }
}

// Load patient statistics
async function loadPatientStats() {
    try {
        const response = await fetch(`${API_BASE}/api/patients/stats`, {
            headers: authHeaders()
        });
        
        if (response.ok) {
            const stats = await response.json();
            
            // Update stat cards
            const statCards = document.querySelectorAll('.stat-card .stat-info h3');
            
            if (statCards.length >= 1 && stats.upcomingAppointments !== undefined) {
                statCards[0].textContent = stats.upcomingAppointments;
            }
            
            if (statCards.length >= 2 && stats.totalMedicalRecords !== undefined) {
                statCards[1].textContent = stats.totalMedicalRecords;
            }
        }
    } catch (error) {
        console.error('Error loading patient stats:', error);
    }
}

// Load appointments
async function loadAppointments() {
    try {
        const response = await fetch(`${API_BASE}/api/appointments/patient`, {
            headers: authHeaders()
        });
        
        if (response.ok) {
            const appointments = await response.json();
            
            // Handle paginated response
            const appointmentList = appointments.content || appointments;
            
            // Filter upcoming appointments (not completed or cancelled)
            const upcomingAppointments = appointmentList.filter(apt => 
                apt.status !== 'COMPLETED' && 
                apt.status !== 'CANCELLED' &&
                new Date(apt.appointmentDate) >= new Date()
            );
            
            // Sort by date and time
            upcomingAppointments.sort((a, b) => {
                const dateA = new Date(a.appointmentDate + 'T' + (a.appointmentTime || '00:00:00'));
                const dateB = new Date(b.appointmentDate + 'T' + (b.appointmentTime || '00:00:00'));
                return dateA - dateB;
            });
            
            // Update stats
            updateAppointmentStats(upcomingAppointments, appointmentList);
            
            // Render appointments
            renderAppointments(upcomingAppointments);
        } else {
            console.error('Failed to load appointments');
            showNoAppointments();
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        showNoAppointments();
    }
}

// Update appointment statistics
function updateAppointmentStats(upcomingAppointments, allAppointments) {
    // Update upcoming appointments count
    const upcomingCount = upcomingAppointments.length;
    const statCards = document.querySelectorAll('.stat-card .stat-info h3');
    
    if (statCards.length >= 1) {
        statCards[0].textContent = upcomingCount;
    }
    
    // Count total medical records (completed appointments)
    const completedCount = allAppointments.filter(apt => apt.status === 'COMPLETED').length;
    if (statCards.length >= 2) {
        statCards[1].textContent = completedCount;
    }
}

// Render appointments in the list
function renderAppointments(appointments) {
    const container = document.querySelector('.card .list-header').parentElement;
    const listHeader = container.querySelector('.list-header');
    
    // Clear existing appointments (keep header)
    const existingItems = container.querySelectorAll('.appointment-item');
    existingItems.forEach(item => item.remove());
    
    if (appointments.length === 0) {
        showNoAppointments();
        return;
    }
    
    // Show only first 3 upcoming appointments
    const displayAppointments = appointments.slice(0, 3);
    
    displayAppointments.forEach(apt => {
        const appointmentItem = createAppointmentElement(apt);
        container.appendChild(appointmentItem);
    });
}

// Create appointment HTML element
function createAppointmentElement(apt) {
    const div = document.createElement('div');
    div.className = 'appointment-item';
    
    // Format date
    const date = new Date(apt.appointmentDate);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Format time
    const timeStr = formatTime(apt.appointmentTime);
    
    // Get doctor name
    const doctorName = apt.doctorName || (apt.doctor ? apt.doctor.fullName : 'Doctor');
    const specialization = apt.specialization || (apt.doctor ? apt.doctor.specialization : 'General');
    
    // Get status badge
    const statusBadge = getStatusBadge(apt.status);
    
    div.innerHTML = `
        <div class="appointment-doc">
            <div class="doc-avatar">${doctorName.charAt(0)}</div>
            <div class="doc-info">
                <h4>Dr. ${doctorName}</h4>
                <p>${specialization} • ${apt.location || 'HealthConnect Clinic'}</p>
            </div>
        </div>
        <div class="appointment-time">
            <p class="appointment-date">${dateStr}</p>
            <p class="appointment-slot">${timeStr}</p>
            ${statusBadge}
        </div>
    `;
    
    // Make clickable
    div.style.cursor = 'pointer';
    div.onclick = () => {
        window.location.href = `appointment_details.html?id=${apt.id}`;
    };
    
    return div;
}

// Format time from HH:mm:ss to HH:mm AM/PM
function formatTime(timeStr) {
    if (!timeStr) return 'Time TBD';
    
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    }
    return timeStr;
}

// Get status badge HTML
function getStatusBadge(status) {
    const statusMap = {
        'CONFIRMED': { class: 'badge-upcoming', text: 'Confirmed' },
        'PENDING': { class: 'badge-pending', text: 'Pending' },
        'COMPLETED': { class: 'badge-completed', text: 'Completed' },
        'CANCELLED': { class: 'badge-cancelled', text: 'Cancelled' }
    };
    
    const statusInfo = statusMap[status] || { class: 'badge-upcoming', text: status };
    return `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;
}

// Show no appointments message
function showNoAppointments() {
    const container = document.querySelector('.card .list-header').parentElement;
    const existingItems = container.querySelectorAll('.appointment-item');
    existingItems.forEach(item => item.remove());
    
    const noAppointmentsDiv = document.createElement('div');
    noAppointmentsDiv.style.cssText = 'padding: 2rem; text-align: center; color: #6B7280;';
    noAppointmentsDiv.innerHTML = `
        <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>No upcoming appointments</p>
        <a href="doctor_search.html" style="color: var(--primary); text-decoration: none; font-weight: 600;">
            Book your first appointment →
        </a>
    `;
    container.appendChild(noAppointmentsDiv);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!checkAuth()) {
        return;
    }
    
    // Load user profile, stats, and appointments
    await loadUserProfile();
    await loadPatientStats();
    await loadAppointments();
    
    // Setup notification badge (if notifications exist)
    updateNotificationBadge();
});

// Update notification badge
function updateNotificationBadge() {
    // This will be connected to your notification system
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        // For now, set to 0 or fetch from API
        badge.textContent = '0';
    }
}
