document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(loginForm);

        fetch('http://127.0.0.1:5000/admin/login', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Login successful, redirect to admin page (create this page next)
                window.location.href = '/admin.html'; // Assuming you'll create an admin.html
            } else {
                // Login failed, display error message
                response.json().then(data => {
                    errorMessage.textContent = data.message || 'Login failed';
                });
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            errorMessage.textContent = 'An error occurred during login.';
        });
    });
});