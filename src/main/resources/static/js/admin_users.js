/**
 * Admin Users Management - HealthConnect
 * Handles user listing, filtering, and doctor approval
 */

const API_BASE = '/api/admin/users';
const getToken = () => localStorage.getItem('token');
const authHeader = () => ({
    'Authorization': 'Bearer ' + getToken(),
    'Content-Type': 'application/json'
});

let currentTab = 'patientsTab';
let currentPage = 0;
let totalPages = 1;
const pageSize = 10;

// Check authentication
function checkAuth() {
    const token = getToken();
    const role = localStorage.getItem('userRole');
    console.log(role, token);


    if (!token || role !== 'ADMIN') {
        window.location.href = '/login.html';
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
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        font-weight: 600;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Tab switching
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.target;
            currentPage = 0;
            loadUsers();
        });
    });
}

// Load users based on current tab
async function loadUsers() {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center">Loading...</td></tr>';

    let endpoint = '';
    if (currentTab === 'patientsTab') {
        endpoint = `${API_BASE}/patients?page=${currentPage}&size=${pageSize}`;
    } else if (currentTab === 'doctorsTab') {
        endpoint = `${API_BASE}/doctors?page=${currentPage}&size=${pageSize}`;
    } else {
        endpoint = `${API_BASE}?page=${currentPage}&size=${pageSize}`;
    }

    try {
        const response = await fetch(endpoint, {
            headers: authHeader()
        });

        if (response.ok) {
            const data = await response.json();
            totalPages = data.totalPages || 1;

            if (currentTab === 'patientsTab') {
                displayPatients(data.content || []);
            } else if (currentTab === 'doctorsTab') {
                displayDoctors(data.content || []);
            } else {
                displayAdmins(data.content || []);
            }

            updatePagination();
        } else if (response.status === 403) {
            showToast('Access denied. Admin privileges required.', 'error');
            setTimeout(() => window.location.href = '/login.html', 2000);
        } else {
            throw new Error('Failed to load users');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="text-center" style="color: #EF4444;">Failed to load users. Please try again.</td></tr>';
        showToast('Failed to load users', 'error');
    }
}

// Display patients
function displayPatients(patients) {
    const tbody = document.getElementById('userTableBody');

    if (patients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No patients found</td></tr>';
        return;
    }

    tbody.innerHTML = patients.map(patient => `
        <tr>
            <td>#${patient.id}</td>
            <td>${patient.fullName || 'N/A'}</td>
            <td>${patient.user?.email || 'N/A'}</td>
            <td>${patient.user?.phone || 'N/A'}</td>
            <td><span class="badge ${patient.user?.active ? 'badge-success' : 'badge-danger'}">${patient.user?.active ? 'Active' : 'Inactive'}</span></td>
            <td>${formatDate(patient.user?.createdAt)}</td>
            <td>
                <button onclick="toggleUserStatus(${patient.user?.id})" class="btn-icon" title="Toggle Status">
                    <i class="fas fa-toggle-${patient.user?.active ? 'on' : 'off'}"></i>
                </button>
                <button onclick="viewPatientDetails(${patient.id})" class="btn-icon" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Display doctors
function displayDoctors(doctors) {
    const tbody = document.getElementById('userTableBody');

    if (doctors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No doctors found</td></tr>';
        return;
    }

    tbody.innerHTML = doctors.map(doctor => `
        <tr>
            <td>#${doctor.id}</td>
            <td>
                <div style="font-weight: 600;">${doctor.fullName || 'N/A'}</div>
                <div style="font-size: 0.85rem; color: #6B7280;">${doctor.specialization || doctor.specialty || 'N/A'}</div>
            </td>
            <td>${doctor.user?.email || 'N/A'}</td>
            <td>${doctor.user?.phone || 'N/A'}</td>
            <td>
                <span class="badge ${doctor.isVerified ? 'badge-success' : 'badge-warning'}">
                    ${doctor.isVerified ? 'Verified' : 'Pending'}
                </span>
                ${doctor.user?.active ? '' : '<span class="badge badge-danger">Inactive</span>'}
            </td>
            <td>${formatDate(doctor.user?.createdAt)}</td>
            <td>
                ${!doctor.isVerified ? `
                    <button onclick="approveDoctor(${doctor.id})" class="btn-icon" style="color: #10B981;" title="Approve">
                        <i class="fas fa-check-circle"></i>
                    </button>
                    <button onclick="rejectDoctor(${doctor.id})" class="btn-icon" style="color: #EF4444;" title="Reject">
                        <i class="fas fa-times-circle"></i>
                    </button>
                ` : ''}
                <button onclick="toggleUserStatus(${doctor.user?.id})" class="btn-icon" title="Toggle Status">
                    <i class="fas fa-toggle-${doctor.user?.active ? 'on' : 'off'}"></i>
                </button>
                <button onclick="viewDoctorDetails(${doctor.id})" class="btn-icon" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Display admins
function displayAdmins(users) {
    const tbody = document.getElementById('userTableBody');
    const admins = users.filter(u => u.role === 'ADMIN');

    if (admins.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No admins found</td></tr>';
        return;
    }

    tbody.innerHTML = admins.map(admin => `
        <tr>
            <td>#${admin.id}</td>
            <td>${admin.firstName || ''} ${admin.lastName || ''}</td>
            <td>${admin.email || 'N/A'}</td>
            <td>${admin.phone || 'N/A'}</td>
            <td><span class="badge ${admin.active ? 'badge-success' : 'badge-danger'}">${admin.active ? 'Active' : 'Inactive'}</span></td>
            <td>${formatDate(admin.createdAt)}</td>
            <td>
                <button onclick="toggleUserStatus(${admin.id})" class="btn-icon" title="Toggle Status">
                    <i class="fas fa-toggle-${admin.active ? 'on' : 'off'}"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Approve doctor
async function approveDoctor(doctorId) {
    if (!confirm('Are you sure you want to approve this doctor?')) return;

    try {
        const response = await fetch(`${API_BASE}/doctors/${doctorId}/approve`, {
            method: 'PATCH',
            headers: authHeader()
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Doctor approved successfully!', 'success');
            loadUsers();
        } else {
            console.error('Approval error:', data);
            showToast(data.error || 'Failed to approve doctor', 'error');
        }
    } catch (error) {
        console.error('Error approving doctor:', error);
        showToast('Failed to approve doctor', 'error');
    }
}

// Reject doctor
async function rejectDoctor(doctorId) {
    if (!confirm('Are you sure you want to reject this doctor? This will set their status to unverified.')) return;

    try {
        const response = await fetch(`${API_BASE}/doctors/${doctorId}/reject`, {
            method: 'PATCH',
            headers: authHeader()
        });

        if (response.ok) {
            showToast('Doctor rejected', 'success');
            loadUsers();
        } else {
            const error = await response.json();
            showToast(error.error || 'Failed to reject doctor', 'error');
        }
    } catch (error) {
        console.error('Error rejecting doctor:', error);
        showToast('Failed to reject doctor', 'error');
    }
}

// Toggle user status
async function toggleUserStatus(userId) {
    if (!confirm('Are you sure you want to toggle this user\'s status?')) return;

    try {
        const response = await fetch(`${API_BASE}/${userId}/toggle-status`, {
            method: 'PATCH',
            headers: authHeader()
        });

        if (response.ok) {
            showToast('User status updated', 'success');
            loadUsers();
        } else {
            showToast('Failed to update user status', 'error');
        }
    } catch (error) {
        console.error('Error toggling user status:', error);
        showToast('Failed to update user status', 'error');
    }
}

// View details
function viewPatientDetails(patientId) {
    showToast('Patient details view coming soon', 'info');
}

function viewDoctorDetails(doctorId) {
    showToast('Doctor details view coming soon', 'info');
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Pagination
function updatePagination() {
    document.getElementById('pageIndicator').textContent = `Page ${currentPage + 1} of ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 0;
    document.getElementById('nextPage').disabled = currentPage >= totalPages - 1;
}

function goToPrevPage() {
    if (currentPage > 0) {
        currentPage--;
        loadUsers();
    }
}

function goToNextPage() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        loadUsers();
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('userSearch');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            filterTable(searchTerm);
        }, 300);
    });
}

function filterTable(searchTerm) {
    const rows = document.querySelectorAll('#userTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Export CSV
function exportToCSV() {
    showToast('Export functionality coming soon', 'info');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;

    setupTabs();
    setupSearch();
    loadUsers();

    // Pagination buttons
    document.getElementById('prevPage').addEventListener('click', goToPrevPage);
    document.getElementById('nextPage').addEventListener('click', goToNextPage);

    // Export button
    document.getElementById('exportUsersBtn').addEventListener('click', exportToCSV);
});

// Modal functions
function closeModal() {
    document.getElementById('actionModal').classList.add('hidden');
}
