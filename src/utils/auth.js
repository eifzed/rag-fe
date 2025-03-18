// src/utils/auth.js
import api from '../services/api';

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const checkAuthStatus = async () => {
  try {
    if (!isAuthenticated()) {
      return false;
    }
    
    // Verify token by making a request to /api/auth/me
    const response = await api.get('/auth/me');
    return response.status === 200;
  } catch (error) {
    console.error('Auth verification failed:', error);
    // Clear invalid token
    console.log("removing token from localstorage in utils")
    localStorage.removeItem('token');
    return false;
  }
};