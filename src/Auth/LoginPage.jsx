import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Eye, EyeOff, Lock, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const LoginPage = ({ isModal = false }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [imageIndex, setImageIndex] = useState(0);
  const images = ["/loginlogo.png", "/logo2.png"];

  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Preload images for a seamless transition in production
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        toast.success('Welcome back!');
        // Direct navigate to checklist after login
        navigate('/checklist');
      } else {
        toast.error(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('A system error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginContent = (
    <div className={`w-full ${isModal ? '' : 'max-w-[850px] bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden relative z-10'} flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-700`}>
      {/* Form Section */}
      <div className="flex-1 p-8 sm:p-12 md:p-16">
        <div className="max-w-[320px] mx-auto md:mx-0">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Welcome <span className="text-red-600">Back</span>
            </h1>
            <p className="text-[12px] font-bold text-gray-500 mt-2 uppercase tracking-widest">Sign in to continue</p>
            <div className="h-1.5 w-10 bg-red-600 mt-4 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label htmlFor="username" className="text-[12px] font-black text-gray-600 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600/10 focus:bg-white focus:ring-4 focus:ring-red-600/5 transition-all outline-none"
                  placeholder="Enter username"
                  aria-label="Username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" name="password-label" className="text-[12px] font-black text-gray-600 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600/10 focus:bg-white focus:ring-4 focus:ring-red-600/5 transition-all outline-none"
                  placeholder="••••••••"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-red-900/20 transition-all duration-300 uppercase tracking-[0.2em] text-xs disabled:opacity-70 mt-8 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-red-600/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Image Section with Fade Animation */}
      <div className="hidden md:flex flex-1 bg-gray-50/50 items-center justify-center p-12 lg:p-16 relative overflow-hidden select-none">
        <div className="text-center w-full max-w-[380px] will-change-transform">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={imageIndex}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="w-full"
            >
              <img
                src={images[imageIndex]}
                alt="SKA Ispat Branding"
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 space-y-3">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest">SKA ISPAT</h2>
            <div className="h-1 w-10 bg-red-600 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) return loginContent;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-red-100 selection:text-red-900">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gray-100 rounded-full blur-[120px] -ml-64 -mb-64 opacity-50 pointer-events-none"></div>
      {loginContent}
    </div>
  );
};

export default LoginPage;
