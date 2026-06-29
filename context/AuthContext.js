"use client";
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/users/profile');
          setUser(res.data);
        }
      } catch (err) {
        console.error('Not logged in', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    if (res.data.user.role === 'artist') router.push('/dashboard/artist');
    else if (res.data.user.role === 'admin') router.push('/dashboard/admin');
    else router.push('/');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    router.push('/');
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const googleLogin = async (googleData) => {
    const res = await api.post('/auth/google', googleData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    
    if (res.data.isNewUser) {
      setShowRoleModal(true);
    } else {
      if (res.data.user.role === 'artist') router.push('/dashboard/artist');
      else if (res.data.user.role === 'admin') router.push('/dashboard/admin');
      else router.push('/');
    }
  };

  const updateUserRole = async (role) => {
    try {
      const res = await api.put('/users/profile', { role });
      setUser(res.data);
      setShowRoleModal(false);
      
      if (res.data.role === 'artist') router.push('/dashboard/artist');
      else if (res.data.role === 'admin') router.push('/dashboard/admin');
      else router.push('/');
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, googleLogin, showRoleModal, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
