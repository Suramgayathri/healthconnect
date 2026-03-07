document.addEventListener('DOMContentLoaded', ()=> {
                const token=localStorage.getItem('token');
                const role=localStorage.getItem('userRole');

                if ( !token || role !=='PATIENT') {
                    window.location.href='login.html';
                    return;
                }

                document.getElementById('userName').innerText=localStorage.getItem('userEmail');
            });

        function logout() {
            localStorage.clear();
            window.location.href='login.html';
        }
