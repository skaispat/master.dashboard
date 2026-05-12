import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, LogOut, User, ShieldCheck, ShieldUser } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../Auth/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from '../Auth/LoginPage';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  // Close modal when user is logged in
  useEffect(() => {
    if (user && showLoginModal) {
      setShowLoginModal(false);
    }
  }, [user, showLoginModal]);

  // Force close drawer when user logs out
  useEffect(() => {
    if (!user && isOpen) {
      setIsOpen(false);
    }
  }, [user, isOpen]);

  const isLandingPage = location.pathname === '/';

  const navLinks = user ? [
    { name: 'Checklist', href: '/checklist' },
    { name: 'Documents', href: '/documents' },
  ] : [];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
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
                {user ? (
                  <>
                    <span className={`text-[12px] font-bold uppercase tracking-wider ${(scrolled || !isLandingPage) ? 'text-gray-400' : 'text-red-600'
                      }`}>
                      {user?.username}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white p-2.5 rounded-full hover:bg-black transition-all shadow-lg shadow-red-900/20 active:scale-95"
                      title="Logout"
                    >
                      <LogOut size={16} />
                    </button>
                  </>
                ) : (
                  <div className="relative group/tooltip">
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className={`flex items-center justify-center gap-2 px-4 h-10 rounded-xl font-black transition-all active:scale-95 ${(scrolled || !isLandingPage)
                        ? 'bg-red-600 text-white hover:bg-black shadow-lg shadow-red-900/20'
                        : 'bg-white text-red-600 hover:bg-red-50'
                        }`}
                    >
                      <ShieldUser size={22} />
                      <span className="text-[10px] uppercase tracking-widest">Login</span>
                    </button>
                    {/* Custom Tooltip */}
                    <div className="absolute top-full right-0 mt-3 px-3 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 translate-y-2 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-300 whitespace-nowrap z-[1001]">
                      Login Here
                      <div className="absolute -top-1 right-5 w-2 h-2 bg-black rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu / Login Toggle */}
            <div className="lg:hidden flex items-center gap-4 relative z-[110]">
              {user ? (
                <button
                  className={`w-10 h-10 flex items-center justify-center rounded-xl active:scale-90 transition-all ${(scrolled || !isLandingPage || isOpen) ? 'bg-gray-50 text-red-600' : 'bg-white/20 text-white backdrop-blur-sm'
                    }`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`flex items-center gap-2 px-4 h-9 rounded-xl font-black transition-all active:scale-90 ${(scrolled || !isLandingPage) ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-white text-red-600 shadow-lg'
                    }`}
                >
                  <ShieldUser size={22} />
                  <span className="text-[10px] uppercase tracking-widest">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </nav>

      {/* Mobile Menu Overlay */}
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
              <div className="flex items-center justify-end px-6 py-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-full bg-gray-50 text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

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

              <div className="p-6">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-6 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all"
                  >
                    Logout <LogOut size={20} />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowLoginModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all"
                  >
                    <ShieldUser size={22} /> Login Here
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[850px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-6 right-6 z-50 p-3 rounded-full bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
              <div className="max-h-[90vh] overflow-y-auto no-scrollbar">
                <LoginPage isModal={true} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
