// src/hooks/useContextDetail.js
import { useState, useEffect, useCallback } from 'react';
import { getContextById, uploadDocumentToContext, deleteDocumentFromContext, uploadTextDocumentToContext } from '../services/api';

export const useContextDetail = (contextId) => {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOperationLoading, setIsOperationLoading] = useState(false);

  const fetchContextDetail = useCallback(async () => {
    if (!contextId) return;
    
    try {
      setLoading(true);
      const data = await getContextById(contextId);
      setContext(data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch context details: ${err.message || 'Unknown error'}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [contextId]);

  useEffect(() => {
    fetchContextDetail();
  }, [fetchContextDetail]);

  const uploadDocument = async (file) => {
    try {
      setIsOperationLoading(true);
      await uploadDocumentToContext(contextId, file);
      await fetchContextDetail();
      return true;
    } catch (err) {
      setError(`Failed to upload document: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsOperationLoading(false);
    }
  };

  const uploadDocumentText = async (data) => {
    try {
      setIsOperationLoading(true);
      await uploadTextDocumentToContext(contextId, data);
      await fetchContextDetail();
      return true;
    } catch (err) {
      setError(`Failed to upload document: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsOperationLoading(false);
    }
  };

  const deleteDocument = async (fileId) => {
    try {
      setIsOperationLoading(true);
      await deleteDocumentFromContext(contextId, fileId);
      await fetchContextDetail();
      return true;
    } catch (err) {
      setError(`Failed to delete document: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsOperationLoading(false);
    }
  };

  return { 
    context, 
    loading, 
    error, 
    isOperationLoading,
    fetchContextDetail, 
    uploadDocument, 
    uploadDocumentText,
    deleteDocument 
  };
};