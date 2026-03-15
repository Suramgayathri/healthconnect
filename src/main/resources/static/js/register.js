function selectRole(role, element) {
            document.querySelectorAll('.role-card').forEach(card => card.classList.remove('active'));
            element.classList.add('active');

            // Toggle form fields based on role
            const patientFields = document.querySelectorAll('.patient-fields');
            if (role === 'PATIENT') {
                patientFields.forEach(el => el.style.display = window.innerWidth > 768 && el.classList.contains('form-row') ? 'grid' : 'block');
            } else {
                patientFields.forEach(el => el.style.display = 'none');
            }
        }

        let otpTimerInterval = null;

        function startOtpTimer() {
            let timeLeft = 120; // 2 minutes in seconds
            const timerDisplay = document.getElementById('timerDisplay');
            const resendLink = document.getElementById('resendLink');
            
            // Disable resend link initially
            resendLink.style.pointerEvents = 'none';
            resendLink.style.opacity = '0.5';
            
            // Clear any existing timer
            if (otpTimerInterval) {
                clearInterval(otpTimerInterval);
            }
            
            otpTimerInterval = setInterval(() => {
                timeLeft--;
                
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                if (timeLeft <= 0) {
                    clearInterval(otpTimerInterval);
                    timerDisplay.textContent = 'Expired';
                    timerDisplay.style.color = '#EF4444';
                    
                    // Enable resend link
                    resendLink.style.pointerEvents = 'auto';
                    resendLink.style.opacity = '1';
                    resendLink.textContent = 'OTP Expired - Click to Resend';
                    
                    // Disable OTP inputs
                    document.querySelectorAll('.otp-input').forEach(input => {
                        input.disabled = true;
                        input.style.opacity = '0.5';
                    });
                } else if (timeLeft <= 30) {
                    // Change color to red when less than 30 seconds
                    timerDisplay.style.color = '#EF4444';
                }
            }, 1000);
        }

        function togglePassword() {
            const pwdInput = document.getElementById('password');
            const eyeIcon = document.querySelector('.fa-eye');
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                eyeIcon.classList.remove('fa-eye');
                eyeIcon.classList.add('fa-eye-slash');
            } else {
                pwdInput.type = 'password';
                eyeIcon.classList.remove('fa-eye-slash');
                eyeIcon.classList.add('fa-eye');
            }
        }

        function checkStrength() {
            const pwd = document.getElementById('password').value;
            const bar = document.getElementById('strengthBar');
            const text = document.getElementById('strengthText');

            let strength = 0;
            if (pwd.length > 5) strength += 25;
            if (pwd.match(/[a-z]+/)) strength += 25;
            if (pwd.match(/[A-Z]+/)) strength += 25;
            if (pwd.match(/[@$!%*#?&]+/)) strength += 25;

            bar.style.width = strength + '%';

            if (strength <= 25) {
                bar.style.background = '#EF4444'; // Danger
                text.innerText = 'Weak';
            } else if (strength <= 50) {
                bar.style.background = '#F59E0B'; // Warning
                text.innerText = 'Fair';
            } else if (strength <= 75) {
                bar.style.background = '#3B82F6'; // Blue
                text.innerText = 'Good';
            } else {
                bar.style.background = '#10B981'; // Success
                text.innerText = 'Strong';
            }
        }

        function showOtp() {
            // Basic validation
            if (!document.getElementById('fullName').value || !document.getElementById('email').value ||
                !document.getElementById('phone').value || !document.getElementById('password').value) {
                alert("Please fill all required fields first.");
                return;
            }

            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            // Disable button and show loading
            const verifyBtn = document.getElementById('verifyBtn');
            verifyBtn.disabled = true;
            verifyBtn.innerHTML = '<div class="loader"></div> Sending OTP...';

            // Call backend to send OTP
            fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, phone: phone })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    verifyBtn.disabled = false;
                    verifyBtn.innerHTML = 'Send OTP';
                } else {
                    alert('OTP sent to your email: ' + email);
                    // Show OTP section
                    verifyBtn.style.display = 'none';
                    document.getElementById('otpSection').style.display = 'block';
                    document.getElementById('registerBtn').style.display = 'flex';
                    
                    // Start countdown timer
                    startOtpTimer();
                }
            })
            .catch(error => {
                alert('Failed to send OTP. Please try again.');
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = 'Send OTP';
            });
        }

        function resendOtp() {
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            // Clear OTP inputs and re-enable them
            document.querySelectorAll('.otp-input').forEach(input => {
                input.value = '';
                input.disabled = false;
                input.style.opacity = '1';
            });
            
            // Reset timer display
            const timerDisplay = document.getElementById('timerDisplay');
            timerDisplay.style.color = 'var(--primary)';
            
            const resendLink = document.getElementById('resendLink');
            resendLink.textContent = 'Resending...';
            resendLink.style.pointerEvents = 'none';

            // Call backend to resend OTP
            fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, phone: phone })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    resendLink.textContent = 'Resend OTP';
                    resendLink.style.pointerEvents = 'auto';
                } else {
                    alert('OTP resent to your email: ' + email);
                    resendLink.textContent = 'Resend OTP';
                    
                    // Restart timer
                    startOtpTimer();
                }
            })
            .catch(error => {
                alert('Failed to resend OTP. Please try again.');
                resendLink.textContent = 'Resend OTP';
                resendLink.style.pointerEvents = 'auto';
            });
        }

        function moveToNext(current, event) {
            if (current.value.length === 1 && event.key !== 'Backspace') {
                let next = current.nextElementSibling;
                if (next) next.focus();
            } else if (event.key === 'Backspace') {
                let prev = current.previousElementSibling;
                if (prev) prev.focus();
            }
        }

        document.getElementById('registerForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            // Check if timer expired
            const timerDisplay = document.getElementById('timerDisplay');
            if (timerDisplay.textContent === 'Expired') {
                alert("OTP has expired. Please click 'Resend OTP' to get a new code.");
                return;
            }

            // Combine DOM validation + OTP check
            const inputs = document.querySelectorAll('.otp-input');
            let otp = '';
            inputs.forEach(input => otp += input.value);
            if (otp.length < 6) {
                alert("Please enter a valid 6-digit OTP");
                return;
            }

            const email = document.getElementById('email').value;

            // Show loading
            document.getElementById('btnText').style.display = 'none';
            document.getElementById('btnLoader').style.display = 'block';
            document.getElementById('registerBtn').disabled = true;
            document.getElementById('errorMessage').style.display = 'none';

            // First verify OTP
            try {
                const verifyResponse = await fetch('/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, otpCode: otp })
                });

                const verifyData = await verifyResponse.json();

                if (!verifyResponse.ok || !verifyData.verified) {
                    document.getElementById('errorMessage').innerText = verifyData.error || 'Invalid OTP. Please try again.';
                    document.getElementById('errorMessage').style.display = 'block';
                    resetBtn();
                    return;
                }

                // OTP verified, proceed with registration
                const role = document.querySelector('input[name="role"]:checked').value;

                const payload = {
                    fullName: document.getElementById('fullName').value,
                    email: email,
                    phone: document.getElementById('phone').value,
                    password: document.getElementById('password').value,
                    role: role,
                    dob: document.getElementById('dob') ? document.getElementById('dob').value : null,
                    gender: document.getElementById('gender') ? document.getElementById('gender').value : null,
                    bloodGroup: document.getElementById('bloodGroup') ? document.getElementById('bloodGroup').value : null
                };

                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    // Success! 
                    alert('Registration successful! Redirecting to login...');
                    window.location.href = 'login.html';
                } else {
                    document.getElementById('errorMessage').innerText = data.error || 'Registration failed.';
                    document.getElementById('errorMessage').style.display = 'block';
                    resetBtn();
                }
            } catch (error) {
                document.getElementById('errorMessage').innerText = 'Server error. Please try again.';
                document.getElementById('errorMessage').style.display = 'block';
                resetBtn();
            }
        });

        function resetBtn() {
            document.getElementById('btnText').style.display = 'block';
            document.getElementById('btnLoader').style.display = 'none';
            document.getElementById('registerBtn').disabled = false;
        }
