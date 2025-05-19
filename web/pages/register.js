import React, { useState } from 'react';
import Layout from '../components/Layout';
import { auth } from '../utils/firebase'; // Import auth
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import createUserWithEmailAndPassword
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

    // If client-side validation passes, use Firebase Authentication
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Successfully registered with Firebase:', user);

      // Optional: Send Firebase UID to your backend to link users
      // const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      // try {
      //   const backendResponse = await fetch(`${apiUrl}/auth/register_firebase`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       firebase_uid: user.uid,
      //       email: user.email,
      //       username: username, // Use the username entered in the form
      //       // Include any other necessary user data
      //     }),
      //   });
      //   const backendData = await backendResponse.json();
      //   if (!backendResponse.ok) {
      //     console.error('Failed to link Firebase user with backend:', backendData);
      //   }
      // } catch (backendError) {
      //   console.error('Error linking Firebase user with backend:', backendError);
      // }

      alert('Registration successful with Firebase!'); // Display success message
      router.push('/admin/login'); // Redirect to login page

    } catch (error) {
      console.error('Firebase registration error:', error);
      // Handle specific Firebase errors here (e.g., 'auth/email-already-in-use')
      setErrorMessage(`Firebase registration failed: ${error.message}`); // Display Firebase error message
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