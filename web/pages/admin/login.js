import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const AdminLoginPage = () => {
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
    </Layout>
  );
};

export default AdminLoginPage;