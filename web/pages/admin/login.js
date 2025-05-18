import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router'; // Using useRouter for pages directory

const AdminLoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        login(); // Call the login function from AuthContext
        router.push('/admin/dashboard'); // Redirect to admin dashboard
      } else {
        alert(`Login failed: ${data.message}`); // Display error message
      }
    })
    .catch((error) => {
      console.error('Error during login:', error);
      alert('An error occurred during login.'); // Display a generic error message
    });
  };
  const router = useRouter();

  return (
    <Layout>
      <div>
        <h1>Admin Login Page</h1>
        <p>This is the admin login page content.</p>
        <div>
          <Link href="/">Public Menu</Link>
          <br />
          <Link href="/register">Register</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </Layout>
  );
};

export default AdminLoginPage;