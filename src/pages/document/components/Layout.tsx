import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-full h-full bg-gray-50 font-sans overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop and Mobile */}
      <div className={`
        fixed top-0 left-0 bottom-0 z-[510] w-72 transform bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-64 lg:z-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Toggle Button (Visible when sidebar is hidden on mobile) */}
        <div className="lg:hidden p-4 bg-white border-b border-gray-100 flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-4 text-xs font-black uppercase tracking-widest text-gray-900">Documents</span>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>

        {/* Minimal Footer */}
        {/* <footer className="bg-white border-t border-gray-100 py-2 px-6">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>&copy; 2026 Docs Manager</span>
            <div className="flex gap-4">
                <span className="text-gray-300">|</span>
                <span className="text-gray-900">v1.2.0</span>
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  );
};

export default Layout;
