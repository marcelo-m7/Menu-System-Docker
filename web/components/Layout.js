import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>UAlg Cantina</h1>
        {/* Navigation or other header content can go here */}
      </header>
      <main>
        {children}
      </main>
      <footer>
        <p>© 2023 UAlg Cantina. All rights reserved.</p>
        {/* Other footer content */}
      </footer>
    </div>
  );
};

export default Layout;