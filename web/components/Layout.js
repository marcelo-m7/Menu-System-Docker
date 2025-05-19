import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
// Import the correct hook based on your Next.js version (app router or pages router)
// import { useRouter } from 'next/navigation'; // For App Router
import { useRouter } from 'next/router'; // For Pages Router

const Layout = ({ children }) => {
  const { isLoggedIn, logout } = useAuth();
  // Use the correct hook based on your Next.js version
  // const router = useRouter(); // For App Router
  const router = useRouter(); // For Pages Router

  const handleLogout = () => {
    logout();
    router.push('/admin/login'); // Redirect to login page after logout
  };

  return (
    <div>
      <nav>
        <Link href="/">Public Menu</Link> | <Link href="/admin/login">Admin Login</Link>
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
      </nav>
      <main>
        {children}
      </main>
      <footer>© 2023 UAlg Cantina. All rights reserved.</footer>
    </div>
  );
};

export default Layout;