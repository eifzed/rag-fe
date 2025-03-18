// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to automatically add the token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getContexts = async (searchTerm = '') => {
  try {
    const params = searchTerm ? { name: searchTerm } : {};
    const response = await api.get('/contexts', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching contexts:', error);
    throw error;
  }
};

export const getContextById = async (contextId) => {
  try {
    const response = await api.get(`/contexts/${contextId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching context ${contextId}:`, error);
    throw error;
  }
};

export const createContext = async (name, description) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    
    const response = await api.post('/contexts', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating context:', error);
    throw error;
  }
};

export const uploadDocumentToContext = async (contextId, file) => {
  try {
    const formData = new FormData();
    formData.append('files', file);
    
    const response = await api.post(`/contexts/${contextId}/documents`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error uploading document to context ${contextId}:`, error);
    throw error;
  }
};

export const deleteDocumentFromContext = async (contextId, fileId) => {
  try {
    await api.delete(`/contexts/${contextId}/documents/${fileId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting document ${fileId} from context ${contextId}:`, error);
    throw error;
  }
};

export const sendChatMessage = async (contextId, message, history = []) => {
  try {
    const response = await api.post('/chat', {
      context_id: contextId,
      message,
      history,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

export const signup = async (email, password) => {
  try {
    const response = await api.post('/auth/signup', {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error('Error signup:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    // Save token to localStorage after successful login
    if (response.data && response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response;
  } catch (error) {
    console.error('Error login:', error);
    throw error;
  }
};

// Add a logout function to clear the token
export const logout = () => {
  localStorage.removeItem('token');
};

export default api;