import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router'; // Import useRouter for redirection

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e) => { // Make the function async
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // If client-side validation passes, make API call
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) { // Check if status is 200 or 201
        alert('Registration successful!'); // Display success message
        router.push('/admin/login'); // Redirect to login page
      } else {
        setErrorMessage(data.message || 'Registration failed.'); // Display API error message
      }
    } catch (error) {
      setErrorMessage('An error occurred during registration.');
    }
  };

  return (
    <Layout>
      <div>
        <h1>User Registration</h1>
        <p>This is the user registration page.</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button type="submit">Register</button>
        </form>
      </div>
    </Layout>
  );
};
export default RegisterPage;