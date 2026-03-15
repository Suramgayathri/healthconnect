// Hospital Search - HealthConnect (Database-backed)

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

let hospitalsCache = [];

// Show loading state
function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('hospitalsGrid').style.display = 'none';
    document.getElementById('noResults').style.display = 'none';
}

// Hide loading state
function hideLoading() {
    document.getElementById('loadingState').style.display = 'none';
}

// Load hospitals from database
async function loadHospitalsFromDb() {
    showLoading();
    try {
        console.log('Fetching hospitals from:', `${API_BASE}/api/hospitals`);
        console.log('Auth token:', getToken() ? 'Present' : 'Missing');
        
        const response = await fetch(`${API_BASE}/api/hospitals`, {
            headers: authHeaders()
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to load hospitals: ${response.status} - ${errorText}`);
        }

        const hospitals = await response.json();
        console.log('Loaded hospitals:', hospitals);
        console.log('Number of hospitals:', hospitals.length);
        
        if (!hospitals || hospitals.length === 0) {
            console.warn('No hospitals found in database');
            hideLoading();
            showNoResults();
            alert('No hospitals found in the database. Please run the SQL script to insert sample data.');
            return;
        }
        
        hospitalsCache = hospitals.map(h => ({
            hospitalId: h.hospitalId || h.id,
            hospitalName: h.hospitalName || h.name,
            hospitalAddress: h.hospitalAddress || h.address,
            city: h.city,
            state: h.state,
            phone: h.phone,
            email: h.email,
            emergencyServices: h.emergencyServices,
            ambulanceServices: h.ambulanceServices,
            description: h.description
        }));

        console.log('Processed hospitals cache:', hospitalsCache);
        hideLoading();
        renderHospitals(hospitalsCache);
    } catch (error) {
        console.error('Error loading hospitals:', error);
        hideLoading();
        showNoResults();
        alert('Failed to load hospitals: ' + error.message + '\n\nPlease check:\n1. Application is running\n2. You are logged in\n3. SQL script has been run');
    }
}

// Render hospitals
function renderHospitals(hospitals) {
    const grid = document.getElementById('hospitalsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!hospitals || hospitals.length === 0) {
        showNoResults();
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    grid.innerHTML = '';
    
    hospitals.forEach(hospital => {
        const card = createHospitalCard(hospital);
        grid.appendChild(card);
    });
}

// Show no results message
function showNoResults() {
    const grid = document.getElementById('hospitalsGrid');
    const noResults = document.getElementById('noResults');
    
    grid.style.display = 'none';
    noResults.style.display = 'block';
}

// Create hospital card
function createHospitalCard(hospital) {
    const card = document.createElement('div');
    card.className = 'hospital-card';
    
    const hospitalPhoto = getHospitalPhoto(hospital.hospitalName || 'Hospital');
    
    const emergencyBadge = hospital.emergencyServices ? 
        '<span class="service-badge emergency"><i class="fas fa-ambulance"></i> Emergency</span>' : '';
    
    const ambulanceBadge = hospital.ambulanceServices ? 
        '<span class="service-badge ambulance"><i class="fas fa-truck-medical"></i> Ambulance</span>' : '';
    
    card.innerHTML = `
        <div class="hospital-image" style="background-image: url('${hospitalPhoto}');">
            <div class="hospital-image-overlay">
                <div class="hospital-name-overlay">${hospital.hospitalName || ''}</div>
            </div>
        </div>
        <div class="hospital-body">
            <div class="hospital-badges">
                <div class="hospital-type-badge">${hospital.city || 'Hospital'}</div>
                ${emergencyBadge}
                ${ambulanceBadge}
            </div>
            <div class="hospital-info">
                <div class="info-item">
                    <i class="fas fa-map-pin"></i>
                    <span>${hospital.hospitalAddress || 'Address not available'}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-city"></i>
                    <span>${hospital.city || 'City not available'}${hospital.state ? ', ' + hospital.state : ''}</span>
                </div>
                ${hospital.phone ? `
                <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <span>${hospital.phone}</span>
                </div>
                ` : ''}
                ${hospital.email ? `
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <span>${hospital.email}</span>
                </div>
                ` : ''}
            </div>
            ${hospital.description ? `
            <div class="hospital-description">
                <p>${hospital.description}</p>
            </div>
            ` : ''}
            <div class="hospital-actions">
                <button class="btn-action btn-primary-action" onclick='bookAppointment(${hospital.hospitalId}, "${escapeHtml(hospital.hospitalName || "")}")'>
                    <i class="fas fa-calendar-plus"></i> Book Appointment
                </button>
                <button class="btn-action btn-secondary-action" onclick='viewHospitalDetails(${hospital.hospitalId})'>
                    <i class="fas fa-info-circle"></i> Details
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get hospital photo (placeholder)
function getHospitalPhoto(hospitalName) {
    const placeholders = [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
        'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
        'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&q=80',
        'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800&q=80'
    ];
    
    const hash = hospitalName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return placeholders[hash % placeholders.length];
}

// View hospital details
function viewHospitalDetails(hospitalId) {
    const hospital = hospitalsCache.find(h => h.hospitalId === hospitalId);
    if (!hospital) return;
    
    const modal = document.createElement('div');
    modal.className = 'doctor-modal-overlay';
    modal.innerHTML = `
        <div class="doctor-modal">
            <div class="doctor-modal-header">
                <h2><i class="fas fa-hospital"></i> ${hospital.hospitalName}</h2>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="doctor-modal-body" style="padding: 1.5rem;">
                <div class="hospital-detail-section">
                    <h3><i class="fas fa-map-marker-alt"></i> Location</h3>
                    <p>${hospital.hospitalAddress}</p>
                    <p>${hospital.city}${hospital.state ? ', ' + hospital.state : ''}</p>
                </div>
                ${hospital.phone || hospital.email ? `
                <div class="hospital-detail-section">
                    <h3><i class="fas fa-address-book"></i> Contact</h3>
                    ${hospital.phone ? `<p><i class="fas fa-phone"></i> ${hospital.phone}</p>` : ''}
                    ${hospital.email ? `<p><i class="fas fa-envelope"></i> ${hospital.email}</p>` : ''}
                </div>
                ` : ''}
                ${hospital.description ? `
                <div class="hospital-detail-section">
                    <h3><i class="fas fa-info-circle"></i> About</h3>
                    <p>${hospital.description}</p>
                </div>
                ` : ''}
                <div class="hospital-detail-section">
                    <h3><i class="fas fa-concierge-bell"></i> Services</h3>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${hospital.emergencyServices ? '<span class="service-badge emergency"><i class="fas fa-ambulance"></i> 24/7 Emergency</span>' : ''}
                        ${hospital.ambulanceServices ? '<span class="service-badge ambulance"><i class="fas fa-truck-medical"></i> Ambulance Service</span>' : ''}
                        ${!hospital.emergencyServices && !hospital.ambulanceServices ? '<p>Contact hospital for service details</p>' : ''}
                    </div>
                </div>
                <div style="margin-top: 1.5rem;">
                    <button class="btn-action btn-primary-action" style="width: 100%;" onclick='closeModalAndBook(${hospital.hospitalId}, "${escapeHtml(hospital.hospitalName)}")'>
                        <i class="fas fa-calendar-plus"></i> Book Appointment
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.doctor-modal').style.transform = 'scale(1)';
    }, 10);
}

// Close modal and book
function closeModalAndBook(hospitalId, hospitalName) {
    closeModal();
    bookAppointment(hospitalId, hospitalName);
}

// Book appointment at hospital
async function bookAppointment(hospitalId, hospitalName) {
    showLoading();
    
    try {
        const response = await fetch(
            `${API_BASE}/api/doctors/hospital/${hospitalId}`,
            { headers: authHeaders() }
        );
        
        if (response.ok) {
            const doctors = await response.json();
            hideLoading();
            
            if (doctors && doctors.length > 0) {
                showDoctorSelectionModal(hospitalName, doctors);
            } else {
                showNoDoctorsMessage(hospitalName);
            }
        } else {
            hideLoading();
            alert('Unable to load doctors for this hospital. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching doctors:', error);
        hideLoading();
        alert('Failed to load doctors. Please check your connection and try again.');
    }
}

// Show no doctors message
function showNoDoctorsMessage(hospitalName) {
    const modal = document.createElement('div');
    modal.className = 'doctor-modal-overlay';
    modal.innerHTML = `
        <div class="doctor-modal" style="max-width: 500px;">
            <div class="doctor-modal-header">
                <h2><i class="fas fa-info-circle"></i> No Doctors Available</h2>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="doctor-modal-body" style="text-align: center; padding: 2rem;">
                <i class="fas fa-user-md" style="font-size: 4rem; color: var(--gray); opacity: 0.3; margin-bottom: 1rem;"></i>
                <p style="color: var(--dark); margin-bottom: 1rem;">
                    No doctors are currently registered at <strong>${hospitalName}</strong>.
                </p>
                <p style="color: var(--gray); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    Please check back later or try another hospital.
                </p>
                <button class="btn-action btn-primary-action" onclick="closeModal()">
                    <i class="fas fa-arrow-left"></i> Back to Hospitals
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.doctor-modal').style.transform = 'scale(1)';
    }, 10);
}

// Show doctor selection modal
function showDoctorSelectionModal(hospitalName, doctors) {
    const modal = document.createElement('div');
    modal.className = 'doctor-modal-overlay';
    modal.innerHTML = `
        <div class="doctor-modal">
            <div class="doctor-modal-header">
                <h2><i class="fas fa-user-md"></i> Select a Doctor</h2>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="doctor-modal-subtitle">
                <p style="color: var(--gray); font-size: 0.9rem; padding: 0 1.5rem; margin-top: -0.5rem;">
                    <i class="fas fa-hospital"></i> ${hospitalName}
                </p>
            </div>
            <div class="doctor-modal-body" id="doctorList">
                ${doctors.map(doctor => createDoctorCard(doctor)).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.doctor-modal').style.transform = 'scale(1)';
    }, 10);
}

// Create doctor card for modal
function createDoctorCard(doctor) {
    const doctorId = doctor.id || doctor.doctorId;
    const fullName = doctor.fullName || doctor.name || 'Doctor';
    const specialization = doctor.specialization || doctor.specialty || 'General Physician';
    const experience = doctor.experienceYears || doctor.experience || 0;
    const fee = doctor.consultationFee || doctor.fee || 500;
    const rating = doctor.averageRating || doctor.rating || 0;
    const isAvailable = doctor.isAvailable !== false;
    const profilePhoto = doctor.profilePhoto || doctor.photo || null;
    
    const availability = isAvailable ? 
        '<span class="availability-badge available"><i class="fas fa-check-circle"></i> Available</span>' :
        '<span class="availability-badge unavailable"><i class="fas fa-times-circle"></i> Unavailable</span>';
    
    const ratingStars = rating > 0 ? `
        <p class="doctor-rating">
            <i class="fas fa-star"></i> ${rating.toFixed(1)} rating
        </p>
    ` : '';
    
    return `
        <div class="doctor-card-modal">
            <div class="doctor-avatar-modal">
                ${profilePhoto ? 
                    `<img src="${profilePhoto}" alt="${fullName}">` :
                    `<div class="doctor-initial">${fullName.charAt(0)}</div>`
                }
            </div>
            <div class="doctor-info-modal">
                <h3>Dr. ${fullName}</h3>
                <p class="doctor-specialty">${specialization}</p>
                <p class="doctor-experience">
                    <i class="fas fa-briefcase"></i> ${experience} years experience
                </p>
                ${ratingStars}
                <p class="doctor-fee">
                    <i class="fas fa-rupee-sign"></i> ₹${fee} consultation fee
                </p>
                ${availability}
            </div>
            <div class="doctor-actions-modal">
                <button class="btn-book-doctor" onclick='proceedToBooking(${doctorId}, "${escapeHtml(fullName)}")' 
                    ${!isAvailable ? 'disabled' : ''}>
                    <i class="fas fa-calendar-check"></i> Book Appointment
                </button>
            </div>
        </div>
    `;
}

// Proceed to booking with selected doctor
function proceedToBooking(doctorId, doctorName) {
    window.location.href = `appointment_booking.html?doctorId=${doctorId}&doctorName=${encodeURIComponent(doctorName)}`;
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.doctor-modal-overlay');
    if (modal) {
        modal.style.opacity = '0';
        modal.querySelector('.doctor-modal').style.transform = 'scale(0.9)';
        setTimeout(() => modal.remove(), 300);
    }
}

// Filter hospitals based on search input
function filterHospitals() {
    const searchTerm = document.getElementById('hospitalSearchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderHospitals(hospitalsCache);
        return;
    }
    
    const filtered = hospitalsCache.filter(hospital => {
        const name = (hospital.hospitalName || '').toLowerCase();
        const city = (hospital.city || '').toLowerCase();
        const address = (hospital.hospitalAddress || '').toLowerCase();
        const state = (hospital.state || '').toLowerCase();
        
        return name.includes(searchTerm) || 
               city.includes(searchTerm) || 
               address.includes(searchTerm) ||
               state.includes(searchTerm);
    });
    
    renderHospitals(filtered);
}

// Get current location (optional feature)
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toFixed(4);
            const lng = position.coords.longitude.toFixed(4);
            document.getElementById('locationInput').value = `Current Location (${lat}, ${lng})`;
            alert('Location detected! Note: Distance calculation is not yet implemented.');
        },
        (error) => {
            let errorMsg = 'Unable to get your location. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Please allow location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'Location request timed out.';
                    break;
            }
            alert(errorMsg);
        }
    );
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) {
        return;
    }
    
    // Load user info
    const userName = localStorage.getItem('userEmail') || 'Patient';
    document.getElementById('userName').textContent = userName;
    document.getElementById('userInitial').textContent = userName.charAt(0).toUpperCase();
    
    // Setup search input listener
    const searchInput = document.getElementById('hospitalSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterHospitals);
    }
    
    // Load hospitals from database
    loadHospitalsFromDb();
});
