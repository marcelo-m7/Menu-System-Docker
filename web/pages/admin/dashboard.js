import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Assuming you have a Layout component, import and use it
const AdminDashboardPage = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not logged in and isLoggedIn is not undefined (initial render)
    if (!isLoggedIn && isLoggedIn !== undefined) {
      router.push('/admin/login');
    }
  }, [isLoggedIn, router]); // Add router to dependencies

  return isLoggedIn ? (

    // Wrap the content with the Layout component
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Select a section to manage:</p>
      <ul>
        <li>
          <Link href="/admin/dishes">Manage Dishes</Link>
        </li>
        <li>
          <Link href="/admin/allergens">Manage Allergens</Link>
        </li>
        <li>
          <Link href="/admin/menu-items">Manage Weekly Menu Items</Link>
        </li>
      </ul>
    </div>
  ) : null; // Don't render anything if not logged in (useEffect will redirect)
};

export default AdminDashboardPage;