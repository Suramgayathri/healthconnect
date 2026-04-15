let allClinics = [];

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = 'login.html'; return; }

    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('addClinicBtn').addEventListener('click', () => openClinicModal());
    document.getElementById('addFirstClinicBtn').addEventListener('click', () => openClinicModal());
    document.getElementById('saveClinicBtn').addEventListener('click', saveClinic);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);

    // Close modals
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        });
    });
    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal')) e.target.style.display = 'none';
    });

    loadClinics();
});

function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

async function loadClinics() {
    const token = localStorage.getItem('token');
    document.getElementById('clinicsLoader').style.display = 'flex';
    document.getElementById('clinicsList').innerHTML = '';
    document.getElementById('noClinics').style.display = 'none';

    try {
        const response = await fetch('/api/doctors/me/clinics/details', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to load clinics');
        allClinics = await response.json();
        renderClinics();
    } catch (error) {
        console.error(error);
        document.getElementById('clinicsList').innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--danger);">
                <i class="fas fa-exclamation-triangle"></i> Failed to load clinics.
            </div>`;
    } finally {
        document.getElementById('clinicsLoader').style.display = 'none';
    }
}

function renderClinics() {
    const container = document.getElementById('clinicsList');
    const noData = document.getElementById('noClinics');

    if (allClinics.length === 0) {
        container.innerHTML = '';
        noData.style.display = 'flex';
        return;
    }

    noData.style.display = 'none';
    let html = '';

    allClinics.forEach(clinic => {
        html += `
            <div class="clinic-card">
                <div class="clinic-card-header">
                    <div class="clinic-icon">
                        <i class="fas fa-hospital"></i>
                    </div>
                    <div class="clinic-actions">
                        <button class="btn-icon" onclick="editClinic(${clinic.locationId})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-icon-danger" onclick="openDeleteModal(${clinic.locationId})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <h3 class="clinic-name">${clinic.clinicName || 'Unnamed Clinic'}</h3>
                <div class="clinic-details">
                    <div class="detail-row">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${clinic.address || '-'}${clinic.city ? ', ' + clinic.city : ''}${clinic.state ? ', ' + clinic.state : ''} ${clinic.pincode || ''}</span>
                    </div>
                    ${clinic.phone ? `<div class="detail-row"><i class="fas fa-phone"></i><span>${clinic.phone}</span></div>` : ''}
                    ${clinic.consultationFeeAtThisLocation ? `<div class="detail-row fee-row"><i class="fas fa-rupee-sign"></i><span>₹${clinic.consultationFeeAtThisLocation}</span></div>` : ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function openClinicModal(clinicId = null) {
    const modal = document.getElementById('clinicModal');
    const title = document.getElementById('clinicModalTitle');
    const form = document.getElementById('clinicForm');
    form.reset();
    document.getElementById('editClinicId').value = '';

    if (clinicId) {
        title.innerHTML = '<i class="fas fa-hospital"></i> Edit Clinic';
        const clinic = allClinics.find(c => c.locationId === clinicId);
        if (clinic) {
            document.getElementById('editClinicId').value = clinic.locationId;
            document.getElementById('clinicName').value = clinic.clinicName || '';
            document.getElementById('clinicAddress').value = clinic.address || '';
            document.getElementById('clinicCity').value = clinic.city || '';
            document.getElementById('clinicState').value = clinic.state || '';
            document.getElementById('clinicPincode').value = clinic.pincode || '';
            document.getElementById('clinicPhone').value = clinic.phone || '';
            document.getElementById('clinicFee').value = clinic.consultationFeeAtThisLocation || '';
        }
    } else {
        title.innerHTML = '<i class="fas fa-hospital"></i> Add Clinic';
    }

    modal.style.display = 'flex';
}

window.editClinic = function(clinicId) {
    openClinicModal(clinicId);
};

async function saveClinic(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const clinicId = document.getElementById('editClinicId').value;
    const isEdit = !!clinicId;

    const payload = {
        clinicName: document.getElementById('clinicName').value,
        address: document.getElementById('clinicAddress').value,
        city: document.getElementById('clinicCity').value,
        state: document.getElementById('clinicState').value,
        pincode: document.getElementById('clinicPincode').value,
        phone: document.getElementById('clinicPhone').value,
        consultationFee: document.getElementById('clinicFee').value || null
    };

    const url = isEdit ? `/api/doctors/clinics/${clinicId}` : '/api/doctors/clinics';
    const method = isEdit ? 'PUT' : 'POST';

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
            const errText = await response.text();
            throw new Error(errText || 'Failed to save clinic');
        }

        document.getElementById('clinicModal').style.display = 'none';
        loadClinics();
    } catch (err) {
        alert(err.message);
        console.error('Save clinic error:', err);
    }
}

window.openDeleteModal = function(clinicId) {
    document.getElementById('deleteClinicId').value = clinicId;
    document.getElementById('deleteModal').style.display = 'flex';
};

async function confirmDelete() {
    const token = localStorage.getItem('token');
    const clinicId = document.getElementById('deleteClinicId').value;

    try {
        const response = await fetch(`/api/doctors/clinics/${clinicId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Failed to delete clinic');
        }

        document.getElementById('deleteModal').style.display = 'none';
        loadClinics();
    } catch (err) {
        alert(err.message);
        console.error('Delete clinic error:', err);
    }
}
