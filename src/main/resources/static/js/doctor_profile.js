document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('logoutBtnMain').addEventListener('click', logout);

    fetchProfile(token);
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('doctorPublicId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

async function fetchProfile(token) {
    try {
        const response = await fetch('/api/doctors/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to load profile');
        }

        const profile = await response.json();
        renderProfile(profile);

    } catch (error) {
        console.error('Profile error:', error);
        document.getElementById('profileLoader').innerHTML = `
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--danger); margin-bottom: 1rem;"></i>
            <p style="color: var(--danger);">Failed to load profile. Please try again.</p>
        `;
    }
}

function renderProfile(profile) {
    document.getElementById('profileLoader').style.display = 'none';
    document.getElementById('profileContent').style.display = 'block';

    // Header
    document.getElementById('profileName').textContent = profile.fullName || 'Doctor';
    document.getElementById('profileSpecialization').textContent = profile.specialization || '-';

    const photoUrl = profile.profilePhoto || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName || 'D')}&background=4F46E5&color=fff&size=128`;
    document.getElementById('profilePhoto').src = photoUrl;

    // Badges
    document.getElementById('profileRating').textContent = profile.averageRating || 'New';
    document.getElementById('profileExperience').textContent = profile.experienceYears || '0';

    if (profile.isVerified) {
        document.getElementById('badgeVerified').style.display = 'inline-flex';
    }
    if (profile.isAvailable) {
        document.getElementById('badgeAvailable').style.display = 'inline-flex';
    }

    // About
    document.getElementById('profileAbout').textContent = profile.about || 'No detailed bio available yet.';

    // Contact
    document.getElementById('profileEmail').textContent = profile.email || '-';
    document.getElementById('profilePhone').textContent = profile.phone || '-';
    document.getElementById('profileLanguages').textContent = profile.languagesSpoken || 'English';

    // Professional
    document.getElementById('profileSpec2').textContent = profile.specialization || '-';
    document.getElementById('profileQualifications').textContent = profile.qualifications || '-';
    document.getElementById('profileLicense').textContent = profile.licenseNumber || '-';
    document.getElementById('profileFee').textContent = profile.consultationFee ? `₹${profile.consultationFee}` : '-';

    // Stats
    document.getElementById('profileTotalReviews').textContent = profile.totalReviews || '0';
    document.getElementById('profileAvgRating2').textContent = profile.averageRating || '0';
}
