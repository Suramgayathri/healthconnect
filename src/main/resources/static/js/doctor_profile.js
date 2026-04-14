document.addEventListener('DOMContentLoaded', async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const docId = urlParams.get('id');

            if (!docId) {
                alert("Doctor ID missing");
                window.location.href = "doctor_search.html";
                return;
            }

            try {
                const response = await fetch(`/api/doctors/${docId}`);
                if (response.ok) {
                    const doc = await response.json();
                    document.getElementById('docName').innerText = doc.fullName;
                    document.getElementById('docSpecialty').innerText = doc.specialization;
                    document.getElementById('docRating').innerText = doc.averageRating || 'New';
                    document.getElementById('docExp').innerText = doc.experienceYears || '0';
                    document.getElementById('docLang').innerText = doc.languagesSpoken || 'English';
                    document.getElementById('docAbout').innerText = doc.about || 'No detailed bio available for this doctor yet.';
                    document.getElementById('docFee').innerText = doc.consultationFee || '50.00';
                    document.getElementById('docImage').src = doc.profilePhoto || 'https://ui-avatars.com/api/?name=' + doc.fullName + '&background=random';
                    
                    const clinicsDiv = document.getElementById('clinicsContainer');
                    if (doc.clinicLocations && doc.clinicLocations.length > 0) {
                        clinicsDiv.innerHTML = doc.clinicLocations.map(loc => `
                            <div style="display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.25rem; border-bottom: 1px solid #E5E7EB; padding-bottom: 1rem;">
                                <i class="fas fa-map-marker-alt" style="color: var(--danger); font-size: 1.5rem; margin-top: 5px;"></i>
                                <div>
                                    <h4 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${loc.clinicName}</h4>
                                    <p style="color: #6B7280; margin-bottom: 0.25rem; font-size: 0.9rem;">${loc.address}, ${loc.city}, ${loc.state} ${loc.pincode}</p>
                                    ${loc.consultationFeeAtThisLocation ? `<p style="font-weight: 600; color: var(--primary); margin-top: 0.5rem; font-size: 0.9rem;"><i class="fas fa-rupee-sign"></i> ${loc.consultationFeeAtThisLocation} Consultation Fee</p>` : ''}
                                </div>
                            </div>
                        `).join('');
                    } else {
                        clinicsDiv.innerHTML = '<p style="color: #6B7280; font-style: italic;">No clinics linked yet.</p>';
                    }
                }
            } catch (e) {
                console.error("Failed to load doctor", e);
            }
        });

        // Simple interactive mock for time slots
        document.querySelectorAll('.slot:not(.booked)').forEach(slot => {
            slot.addEventListener('click', function () {
                document.querySelectorAll('.slot').forEach(s => s.classList.remove('active'));
                this.classList.add('active');
            });
        });

        document.querySelectorAll('.date-box').forEach(box => {
            box.addEventListener('click', function () {
                document.querySelectorAll('.date-box').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        function bookAppointment() {
            // Placeholder for Phase 3 Booking 
            if (localStorage.getItem('userRole') !== 'PATIENT') {
                alert("Please login as a patient to book appointments.");
                window.location.href = "login.html";
                return;
            }
            window.location.href = "appointment_booking.html";
        }
