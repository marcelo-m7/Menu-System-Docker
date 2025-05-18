import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

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
    < div >
      <h1>Admin Dashboard</h1>
      <p>This is the admin dashboard page. (Content coming soon)</p>
    </div>
  ) : null; // Don't render anything if not logged in (useEffect will redirect)
};

export default AdminDashboardPage;