import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../pages/document/lib/supabase';
import useAuthStore from '../pages/document/store/authStore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session storage on mount
    const savedUser = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
    if (savedUser) {
      setUser({ username: savedUser, role });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.trim())
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('User not found');

      if (data.password === password.trim()) {
        if (data.status === 'inactive') {
          throw new Error('Account is inactive');
        }

        const userInfo = {
          username: data.username,
          role: data.role,
          fullName: data.full_name,
          department: data.department,
          access: data.user_access || (data.role === 'admin' ? 'all' : '')
        };

        // Sync with existing systems' storage
        sessionStorage.setItem('username', userInfo.username);
        sessionStorage.setItem('role', userInfo.role);
        sessionStorage.setItem('department', userInfo.department || '');
        sessionStorage.setItem('user_access', userInfo.access);

        // Sync with Document App Store
        useAuthStore.setState({
          isAuthenticated: true,
          currentUser: {
            id: userInfo.username,
            fullName: userInfo.fullName,
            role: userInfo.role,
            permissions: userInfo.access ? userInfo.access.split(',') : []
          }
        });

        setUser(userInfo);
        return { success: true };
      } else {
        throw new Error('Invalid password');
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    sessionStorage.clear();
    useAuthStore.setState({ isAuthenticated: false, currentUser: null });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
