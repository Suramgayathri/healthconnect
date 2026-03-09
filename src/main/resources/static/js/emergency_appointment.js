// Base configuration
const API_BASE = 'http://localhost:8080';
const getToken = () => localStorage.getItem('token');
const authHeader = () => ({
    'Authorization': 'Bearer ' + getToken(),
    'Content-Type': 'application/json'
});

// Check authentication
function checkAuth() {
    if (!getToken()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        font-weight: 600;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Handle emergency appointment submission
async function submitEmergencyAppointment(event) {
    event.preventDefault();
    
    const formData = {
        symptoms: document.getElementById('symptoms').value,
        severity: document.getElementById('severity').value,
        description: document.getElementById('description').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/api/appointments/emergency`, {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showToast('Emergency appointment booked successfully!', 'success');
            setTimeout(() => window.location.href = 'patient_dashboard.html', 2000);
        } else {
            showToast('Failed to book emergency appointment', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('An error occurred', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    const form = document.getElementById('emergencyForm');
    if (form) {
        form.addEventListener('submit', submitEmergencyAppointment);
    }
});
