// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getContexts = async (searchTerm = '') => {
  try {
    const formData = new FormData();
    if (searchTerm) {
      formData.append('name', searchTerm);
    }
    
    const response = await api.get('/contexts', { 
      data: searchTerm ? formData : undefined 
    });
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

export default api;