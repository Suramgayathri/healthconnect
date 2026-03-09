document.addEventListener('DOMContentLoaded', fetchDoctors);

        async function fetchDoctors() {
            const container = document.getElementById('doctorsContainer');
            const keyword = document.getElementById('keywordSearch')?.value || '';
            const specialty = document.getElementById('specialtySelect')?.value || '';

            container.innerHTML = '<div id="loading"><i class="fas fa-spinner fa-spin fa-2x text-primary"></i> Loading doctors...</div>';

            try {
                // Get JWT token
                const token = localStorage.getItem('token');
                const headers = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                // Construct URL with optional query params
                let url = '/api/doctors/search';
                const params = new URLSearchParams();
                if (keyword) params.append('keyword', keyword);
                if (specialty) params.append('specialty', specialty);
                if (params.toString()) url += '?' + params.toString();

                const response = await fetch(url, { headers });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();

                container.innerHTML = '';

                if (data.length === 0) {
                    container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #6B7280;">No doctors found matching your criteria.</div>';
                    return;
                }

                data.forEach(doc => {
                    const card = document.createElement('div');
                    card.className = 'doctor-card';
                    card.innerHTML = `
                        <div class="doc-card-header">
                            <img src="${doc.profilePhoto || 'https://ui-avatars.com/api/?name=' + doc.fullName + '&background=random'}" alt="${doc.fullName}" class="doc-img">
                            <div class="doc-basic-info">
                                <h3>${doc.fullName}</h3>
                                <div class="doc-specialty">${doc.specialization}</div>
                                <div class="doc-rating">
                                    <i class="fas fa-star"></i> ${doc.averageRating} (${doc.totalReviews} reviews)
                                </div>
                            </div>
                        </div>
                        <div class="doc-card-body">
                            <div class="doc-info-item">
                                <i class="fas fa-graduation-cap"></i>
                                <span>${doc.experienceYears} Years Experience<br><small style="color:#9CA3AF">${doc.qualifications || ''}</small></span>
                            </div>
                            <div class="doc-info-item">
                                <i class="fas fa-comment-medical"></i>
                                <span>${doc.languagesSpoken || 'English'}</span>
                            </div>
                        </div>
                        <div class="doc-card-footer">
                            <div class="fee">$${doc.consultationFee || 0} <span style="font-size:0.8rem;color:#6B7280;font-weight:normal">/visit</span></div>
                            <a href="doctor_profile.html?id=${doc.id}" class="btn-book">Book Slot</a>
                        </div>
                    `;
                    container.appendChild(card);
                });

            } catch (error) {
                container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: red;">Failed to load doctors. Please try again later.</div>';
            }
        }
