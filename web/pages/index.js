import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const HomePage = () => {
  return (
    <Layout>
      <div>
        <h1>Weekly Menu</h1>
        <p>This is where the public weekly menu will be displayed.</p>
      </div>

      <nav>
        <ul>
          <li><Link href="/admin/login">Admin Login</Link></li>
          <li><Link href="/register">Register</Link></li>
        </ul>
      </nav>
    </Layout>
  );
};

export default HomePage;