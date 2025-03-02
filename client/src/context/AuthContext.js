import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { setAuthToken, removeAuthToken } from '../utils/authToken';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      // Set token to localStorage and axios headers
      localStorage.setItem('token', response.data.token);
      setAuthToken(response.data.token);
      
      // Set user
      setUser(response.data.user);
      setLoading(false);
      return response.data.user;
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      // Set token to localStorage and axios headers
      localStorage.setItem('token', response.data.token);
      setAuthToken(response.data.token);
      
      // Set user
      setUser(response.data.user);
      setLoading(false);
      return response.data.user;
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
      throw err;
    }
  };

  // Logout user
  const logout = useCallback(() => {
    // Remove token from localStorage and axios headers
    localStorage.removeItem('token');
    removeAuthToken();
    
    // Clear user state
    setUser(null);
  }, []);

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      return false;
    }
    
    setAuthToken(token);
    setLoading(true);
    
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
      setLoading(false);
      return true;
    } catch (err) {
      // If token is invalid, remove it
      localStorage.removeItem('token');
      removeAuthToken();
      setUser(null);
      setLoading(false);
      return false;
    }
  }, []);

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      
      // Update user state
      setUser(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
      throw err;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.put('/api/auth/password', { currentPassword, newPassword });
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || 
        'Failed to change password. Please try again.'
      );
      throw err;
    }
  };

  // Clear errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        checkAuth,
        updateProfile,
        changePassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
