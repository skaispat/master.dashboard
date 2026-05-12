import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] overflow-hidden">
      {/* Fixed Main Navbar */}
      <Navbar />

      {/* Main Content Area - Offset by Navbar height for dashboard pages, no offset for landing page */}
      <div 
        id="main-scroll-container"
        className={`flex-1 flex overflow-hidden ${isHomePage ? 'pt-0 overflow-y-auto' : 'pt-16 md:pt-20'}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
