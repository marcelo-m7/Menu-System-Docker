export function renderRegister(appElement, router) {
    appElement.innerHTML = `
        <h2>User Registration</h2>
        <p id="message-area" style="color: red;"></p>
        <form id="registration-form">
            <label for="username">Username:</label><br>
            <input type="text" id="username" name="username" required><br><br>
            
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email"><br><br>
            
            <label for="password">Password:</label><br>
            <input type="password" id="password" name="password" required><br><br>
            
            <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="/admin/login">Login here</a>.</p>
    `;

    const registrationForm = appElement.querySelector('#registration-form');
    const messageArea = appElement.querySelector('#message-area');
    const usernameInput = appElement.querySelector('#username');
    const emailInput = appElement.querySelector('#email');
    const passwordInput = appElement.querySelector('#password');

    registrationForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        messageArea.textContent = ''; // Clear previous messages
        messageArea.style.color = 'red'; // Default to red for errors

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: usernameInput.value, email: emailInput.value, password: passwordInput.value })
            });

            const result = await response.json();

            if (response.ok) {
                messageArea.textContent = result.message || 'Registration successful! Redirecting to login...';
                messageArea.style.color = 'green';
                setTimeout(() => {
                    router.navigate('/admin/login');
                }, 2000);
            } else {
                messageArea.textContent = result.message || 'Registration failed.';
            }
        } catch (error) {
            console.error('Error:', error);
            messageArea.textContent = 'An unexpected error occurred.';
        }
    });
}
                }
            } catch (error) {
                console.error('Error:', error);
                if (messageArea) {
                    messageArea.textContent = 'An unexpected error occurred.';
                } else {
                    alert('An error occurred during registration.');
                }
            }
        });
    }
});