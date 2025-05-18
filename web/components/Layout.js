import React from 'react';
import Link from 'next/link';

const Layout = ({ children }) => {
  return (
    <div>
      <nav>
        <Link href="/">Public Menu</Link> | <Link href="/admin/login">Admin Login</Link>
      </nav>
      <main>
        {children}
      </main>
      <footer>© 2023 UAlg Cantina. All rights reserved.</footer>
    </div>
  );
};

export default Layout;