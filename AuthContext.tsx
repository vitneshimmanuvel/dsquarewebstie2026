import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole } from './types';

export const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : (import.meta.env.VITE_API_BASE_URL || 'https://dsqaubackend-o92a.vercel.app/api');


interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
          setToken(storedToken);
        } else {
          // Token expired or invalid
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to load user profile', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const { user: userData, token: userToken } = data.data;
        localStorage.setItem('token', userToken);
        setUser(userData);
        setToken(userToken);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch (err: any) {
      console.error('Login error', err);
      return { success: false, message: 'Server connection failed. Make sure server is running on port 5000.' };
    }
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, phone, role: 'CUSTOMER' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const { user: userData, token: userToken } = data.data;
        localStorage.setItem('token', userToken);
        setUser(userData);
        setToken(userToken);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (err: any) {
      console.error('Registration error', err);
      return { success: false, message: 'Server connection failed. Make sure server is running on port 5000.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const isAdmin = user?.role === UserRole.ADMIN || isSuperAdmin;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isSuperAdmin, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};