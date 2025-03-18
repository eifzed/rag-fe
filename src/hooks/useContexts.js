// src/hooks/useContexts.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { getContexts, createContext } from '../services/api';

export const useContexts = (initialSearchTerm = '') => {
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const isFirstRender = useRef(true);

  const fetchContexts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getContexts(searchTerm);
      setContexts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch contexts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchContexts();
    }
  }, [fetchContexts]);

  const addContext = async (name, description) => {
    try {
      await createContext(name, description);
      fetchContexts();
      return true;
    } catch (err) {
      setError('Failed to create context');
      return false;
    }
  };

  return { 
    contexts, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    fetchContexts, 
    addContext 
  };
};