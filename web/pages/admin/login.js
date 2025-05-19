import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router'; // Using useRouter for pages directory
import { auth } from '../../utils/firebase'; // Import Firebase auth instance
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase login function

const AdminLoginPage = () => {
  const { login } = useAuth();
  // We'll use email instead of username for Firebase Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    // Basic client-side validation
    if (!email || !password) {
      setErrorMessage('Please enter email and password.');
      return;
    }
    console.log('Password:', password);
    console.log('Email:', email);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        console.log('Firebase user logged in:', user);
        login(); // Update AuthContext state
        router.push('/admin/dashboard'); // Redirect to admin dashboard
      })
      .catch((error) => {
        const errorCode = error.code;
        const firebaseErrorMessage = error.message;
        console.error('Firebase login error:', errorCode, firebaseErrorMessage);
        // Display a user-friendly error message based on Firebase error code
        switch (errorCode) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            setErrorMessage('Invalid email or password.');
            break;
          case 'auth/invalid-email':
            setErrorMessage('Invalid email format.');
            break;
          default:
            setErrorMessage(`Login failed. Please try again. (Error: ${errorCode})`);
        }
      });
  };

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
          {/* Changed label and state to use email for Firebase Auth */}
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
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
        {errorMessage && (
          <p style={{ color: 'red' }}>
            {errorMessage}
          </p>
        )}

        <button type="submit">Login</button>
      </form>
    </Layout>
  );
};

export default AdminLoginPage;
