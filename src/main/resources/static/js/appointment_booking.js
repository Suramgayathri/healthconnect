const urlParams = new URLSearchParams(window.location.search);
        const doctorId = urlParams.get('doctorId');
        let selectedTime = null;

        const getToken = () => localStorage.getItem('token');
        const authHeader = () => ({ 'Authorization': 'Bearer ' + getToken(), 'Content-Type': 'application/json' });

        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            if (!getToken() || !doctorId) {
                window.location.href = 'doctor_search.html';
                return;
            }

            // Set min date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('appointmentDate').min = today;

            fetchDoctorDetails();
        });

        async function fetchDoctorDetails() {
            try {
                const response = await fetch(`/api/doctors/${doctorId}`);
                if (response.ok) {
                    const doc = await response.json();
                    document.getElementById('docName').textContent = doc.fullName;
                    document.getElementById('docSpecialty').textContent = doc.specialization;
                    document.getElementById('docFee').textContent = `₹${doc.consultationFee} / Consultation`;
                    if (doc.profilePhoto) document.getElementById('docImg').src = doc.profilePhoto;

                    // Populate locations
                    const locSelect = document.getElementById('locationSelect');
                    if (doc.clinicLocations && doc.clinicLocations.length > 0) {
                        doc.clinicLocations.forEach(loc => {
                            const opt = document.createElement('option');
                            opt.value = loc.locationId;
                            opt.textContent = `${loc.clinicName} - ${loc.city}`;
                            locSelect.appendChild(opt);
                        });
                    } else {
                        locSelect.innerHTML = '<option value="">No clinics available</option>';
                    }
                }
            } catch (err) {
                showError("Failed to load doctor information.");
            }
        }

        // Handle Emergency Toggle
        document.getElementById('isEmergency').addEventListener('change', function () {
            const triage = document.getElementById('triageSection');
            if (this.checked) {
                triage.style.display = 'block';
                document.getElementById('chiefComplaint').required = true;
            } else {
                triage.style.display = 'none';
                document.getElementById('chiefComplaint').required = false;
            }
        });

        // Fetch slots when date or location changes
        document.getElementById('appointmentDate').addEventListener('change', fetchSlots);
        document.getElementById('locationSelect').addEventListener('change', fetchSlots);

        async function fetchSlots() {
            const date = document.getElementById('appointmentDate').value;
            const locId = document.getElementById('locationSelect').value;

            if (!date || !locId) return;

            const slotsGrid = document.getElementById('slotsGrid');
            const loader = document.getElementById('slotsLoader');
            const submitBtn = document.getElementById('submitBtn');

            slotsGrid.innerHTML = '';
            selectedTime = null;
            submitBtn.disabled = true;
            loader.style.display = 'block';

            try {
                const response = await fetch(`/api/appointments/slots?doctorId=${doctorId}&locationId=${locId}&date=${date}`, {
                    headers: authHeader()
                });
                if (response.ok) {
                    const slots = await response.json();
                    if (slots.length === 0) {
                        slotsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--danger);">No slots available on this date.</p>';
                    } else {
                        slots.forEach(slot => {
                            const btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'slot-btn';
                            btn.textContent = slot.startTime.substring(0, 5);

                            if (!slot.available) {
                                btn.disabled = true;
                                btn.style.textDecoration = 'line-through';
                            } else if (slot.emergencySlot) {
                                btn.style.border = '2px dashed var(--danger)';
                                btn.title = 'Designated Emergency Slot';
                            }

                            btn.onclick = () => selectSlot(btn, slot.startTime);
                            slotsGrid.appendChild(btn);
                        });
                    }
                } else {
                    slotsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--danger);">Failed to load slots.</p>';
                }
            } catch (err) {
                showError("Error fetching slots.");
            } finally {
                loader.style.display = 'none';
            }
        }

        function selectSlot(btnElement, time) {
            document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
            btnElement.classList.add('selected');
            selectedTime = time;
            document.getElementById('submitBtn').disabled = false;
        }

        // Handle Form Submission
        document.getElementById('bookingForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!selectedTime) return showError("Please select a time slot.");

            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            const isEmergency = document.getElementById('isEmergency').checked;

            const payload = {
                doctorId: parseInt(doctorId),
                locationId: parseInt(document.getElementById('locationSelect').value),
                appointmentDate: document.getElementById('appointmentDate').value,
                appointmentTime: selectedTime,
                consultationType: document.getElementById('consultationType').value,
                reasonForVisit: document.getElementById('reason').value,
                isEmergency: isEmergency
            };

            if (isEmergency) {
                payload.urgencyLevel = document.getElementById('urgencyLevel').value;
                payload.chiefComplaint = document.getElementById('chiefComplaint').value;
                payload.symptoms = document.getElementById('symptoms').value;
            }

            const endpoint = isEmergency ? '/api/appointments/emergency' : '/api/appointments';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: authHeader(),
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('bookingRef').textContent = '#' + data.bookingReference;
                    document.getElementById('successModal').style.display = 'flex';
                } else {
                    const errMsg = await response.text();
                    showError(errMsg || "Failed to book appointment.");
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (err) {
                showError("A network error occurred.");
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });

        function showError(msg) {
            const alert = document.getElementById('errorAlert');
            alert.textContent = msg;
            alert.style.display = 'block';
            setTimeout(() => alert.style.display = 'none', 5000);
            window.scrollTo(0, 0);
        }
