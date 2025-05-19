import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router'; // Using useRouter for pages directory
import { auth } from '../../utils/firebase'; // Import Firebase auth instance
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase login function

const AdminLoginPage = () => {
  const { login } = useAuth();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // Redirect if already logged in
  if (isLoggedIn) {
    router.push('/admin/dashboard');
    return null; // Prevent rendering login form if logged in
  }
  // We'll use email instead of username for Firebase Auth

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

  // Clear error when typing
  const handleInputChange = (e) => {
    setErrorMessage('');
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </div>
        {error && (
          <p style={{ color: 'red' }}>
            {errorMessage}
          </p>
        )}

        <button type="submit">Login</button>
      </form>
    </Layout>

  )};

export default AdminLoginPage;
