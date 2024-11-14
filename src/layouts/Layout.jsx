// layouts/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationSidebar from '../components/NavigationSidebar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-customDark">
      <NavigationSidebar />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
