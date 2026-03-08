import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.js';

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {'doctor' | 'pharmacist'} role
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User | null} user
 * @property {(email: string, password: string) => Promise<void>} login
 * @property {(email: string, password: string, name: string, role: 'doctor' | 'pharmacist') => Promise<void>} signup
 * @property {() => void} logout
 * @property {boolean} isLoading
 */

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage for demo)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // call backend auth
      const data = await apiService.login(email, password);
      // API returns { access_token, token_type, user }
      const { user, access_token } = data;
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', access_token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, name, role) => {
    setIsLoading(true);
    try {
      const user = await apiService.signup(email, password, name, role);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
