import axios from 'axios';

const API_URL = 'https://rag-production-08bc.up.railway.app/api';
// const API_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Add request interceptor to automatically add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log("token", token)
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
    const response = await api.post('/contexts', {
      name,
      description
    });
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

export const signup = async (email, password, avatar_url) => {
  try {
    const response = await api.post('/auth/signup', {
      email,
      password,
      avatar_url,
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
    
    
    return response;
  } catch (error) {
    console.error('Error login:', error);
    throw error;
  }
};

export const getUserProfile = () => {
  return api.get('/auth/me');
};

export const downloadDocument = async(fileId) => {
  try {
    const response = await api.get(`/download/${fileId}`, {
      responseType: "blob",
    });
    if (response.status !== 200){
      throw new Error("failed to download file")
    }

    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replaceAll('"', "") || "downloaded_file"
        : "downloaded_file";

      // Create a Blob URL and trigger download
      const blobUrl = URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl); // Cleanup
  } catch (error) {
    console.error("Download Error", error)
  }
}

export default api;