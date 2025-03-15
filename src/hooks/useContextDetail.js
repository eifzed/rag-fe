// src/hooks/useContextDetail.js
import { useState, useEffect } from 'react';
import { getContextById, uploadDocumentToContext, deleteDocumentFromContext } from '../services/api';

export const useContextDetail = (contextId) => {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContextDetail = async () => {
    if (!contextId) return;
    
    try {
      setLoading(true);
      const data = await getContextById(contextId);
      setContext(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch context details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContextDetail();
  }, [contextId]);

  const uploadDocument = async (file) => {
    try {
      await uploadDocumentToContext(contextId, file);
      fetchContextDetail();
      return true;
    } catch (err) {
      setError('Failed to upload document');
      return false;
    }
  };

  const deleteDocument = async (fileId) => {
    try {
      await deleteDocumentFromContext(contextId, fileId);
      fetchContextDetail();
      return true;
    } catch (err) {
      setError('Failed to delete document');
      return false;
    }
  };

  return { 
    context, 
    loading, 
    error, 
    fetchContextDetail, 
    uploadDocument, 
    deleteDocument 
  };
};