import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../Auth/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const scrollContainer = document.getElementById('main-scroll-container');
    
    const handleScroll = () => {
      if (scrollContainer) {
        setScrolled(scrollContainer.scrollTop > 10);
      } else {
        setScrolled(window.scrollY > 10);
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const isLandingPage = location.pathname === '/';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Checklist', href: '/checklist' },
    { name: 'Documents', href: '/documents' },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${(scrolled || !isLandingPage)
          ? 'h-16 md:h-20 bg-white shadow-sm border-b border-gray-100 backdrop-blur-md'
          : 'h-20 md:h-28 bg-transparent'
          }`}
      >
        <div className="container mx-auto h-full px-4 md:px-8">
          <div className="flex justify-between items-center h-full">

            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group relative z-[110]">
              <div className="h-10 md:h-14 transition-all duration-500">
                <img
                  src="/logo3.jpg"
                  alt="SKA ISPAT"
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10">
              <div className="flex items-center gap-8">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return link.href.startsWith('#') ? (
                    <a
                      key={link.name}
                      href={link.href}
                      className={`text-[14px] font-black uppercase tracking-[0.2em] transition-all relative group hover:text-red-600 ${active ? 'text-red-600' : (scrolled || !isLandingPage) ? 'text-gray-900' : 'text-red-600'
                        }`}
                    >
                      {link.name}
                      <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-600 transition-all ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`text-[14px] font-black uppercase tracking-[0.2em] transition-all relative group hover:text-red-600 ${active ? 'text-red-600' : (scrolled || !isLandingPage) ? 'text-gray-900' : 'text-red-600'
                        }`}
                    >
                      {link.name}
                      <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-600 transition-all ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                  )
                })}
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-[12px] font-bold uppercase tracking-wider ${(scrolled || !isLandingPage) ? 'text-gray-400' : 'text-white/60'
                  }`}>
                  {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white p-2.5 rounded-full hover:bg-black transition-all shadow-lg shadow-red-900/20 active:scale-95"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            <button
              className={`lg:hidden relative z-[110] w-10 h-10 flex items-center justify-center rounded-xl active:scale-90 transition-all ${(scrolled || !isLandingPage || isOpen) ? 'bg-gray-50 text-red-600' : 'bg-white/20 text-white backdrop-blur-sm'
                }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

      </nav>

      {/* Mobile Menu Overlay - Moved outside <nav> for better isolation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[75%] sm:w-[320px] z-[160] bg-white shadow-2xl flex flex-col lg:hidden"
            >
              {/* Simple Header with Close Button */}
              <div className="flex items-center justify-end px-6 py-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-full bg-gray-50 text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links (Tabs) */}
              <div className="flex-1 overflow-y-auto px-6 pt-4">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.name}
                        to={link.href}
                        className={`block px-4 py-3 text-sm font-black uppercase tracking-widest border-b border-gray-50 transition-colors ${active ? 'text-red-600' : 'text-gray-900 hover:text-red-600'}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Simple Logout at bottom */}
              <div className="p-6">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-between px-6 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all"
                >
                  Logout <LogOut size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
