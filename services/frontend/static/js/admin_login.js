export function renderAdminLogin(appElement, router) {
    appElement.innerHTML = `
        <h2>Admin Login</h2>
        <form id="login-form">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required><br>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required><br>

            <button type="submit">Login</button>
        </form>
        <p id="message-area" style="color: red;"></p>
        <p>Don't have an account? <a href="#" data-navigo="/register">Register here</a>.</p>
    `;

    const loginForm = appElement.querySelector('#login-form');
    const messageArea = appElement.querySelector('#message-area');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(loginForm);
        messageArea.textContent = ''; // Clear message area on new attempt

        fetch('/admin/login', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Login successful, navigate to admin dashboard route
                router.navigate('/admin');
            } else {
                // Login failed, display error message
                response.json().then(data => {
                    messageArea.textContent = data.message || 'Login failed'; // Use the message area
                });
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            messageArea.textContent = 'An error occurred during login.';
        });
    });