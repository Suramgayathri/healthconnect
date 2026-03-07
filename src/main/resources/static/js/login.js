function togglePassword() {
            const pwdInput = document.getElementById('password');
            const eyeIcon = document.querySelector('.fa-eye') || document.querySelector('.fa-eye-slash');
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

        document.getElementById('loginForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const btn = document.getElementById('loginBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;
            document.getElementById('errorMessage').style.display = 'none';

            const payload = {
                identifier: document.getElementById('identifier').value,
                password: document.getElementById('password').value
            };

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    // Store token
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRole', data.role);
                    localStorage.setItem('userId', data.id);
                    localStorage.setItem('userEmail', data.email);

                    // Route to correct dashboard
                    if (data.role === 'PATIENT') {
                        window.location.href = 'patient_dashboard.html';
                    } else if (data.role === 'DOCTOR') {
                        window.location.href = 'doctor_dashboard.html';
                    } else {
                        window.location.href = 'admin_dashboard.html';
                    }
                } else {
                    document.getElementById('errorMessage').innerText = data.error || 'Invalid credentials';
                    document.getElementById('errorMessage').style.display = 'block';
                    resetBtn();
                }
            } catch (error) {
                document.getElementById('errorMessage').innerText = 'Server error. Please try again.';
                document.getElementById('errorMessage').style.display = 'block';
                resetBtn();
            }

            function resetBtn() {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
