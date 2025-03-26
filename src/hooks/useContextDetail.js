// src/hooks/useContextDetail.js
import { useState, useEffect, useCallback } from 'react';
import { getContextById, uploadDocumentToContext, deleteDocumentFromContext, uploadTextDocumentToContext } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

export const useContextDetail = (contextId) => {
  const [context, setContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const { showNotification } = useNotification();

  const fetchContextDetail = useCallback(async () => {
    if (!contextId) return;
    
    try {
      setLoading(true);
      const data = await getContextById(contextId);
      setContext(data);
    } catch (err) {
      const errorMessage = `Failed to fetch context details: ${err.message || 'Unknown error'}`;
      showNotification(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [contextId, showNotification]);

  useEffect(() => {
    if (shouldFetch) {
      fetchContextDetail();
      setShouldFetch(false);
    }
  }, [fetchContextDetail, shouldFetch]);

  const uploadDocument = async (file) => {
    try {
      setIsOperationLoading(true);
      const response =  await uploadDocumentToContext(contextId, file);
      if (response.status===200) {
        showNotification('Document uploaded. Wait until the status is SUCCESS to include it in the chat', 'success');
        setShouldFetch(true);
        await fetchContextDetail();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      const errorMessage = `Failed to upload document: ${err.detail || 'Unknown error'}`;
      showNotification(errorMessage, 'error');
      return false;
    } finally {
      setIsOperationLoading(false);
    }
  };

  const uploadDocumentText = async (data) => {
    try {
      setIsOperationLoading(true);
      const response = await uploadTextDocumentToContext(contextId, data);
      if (response.status===200) {
        showNotification('Document uploaded successfully', 'success');
        setShouldFetch(true);
        await fetchContextDetail();
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = `Failed to upload document: ${err.message || 'Unknown error'}`;
      showNotification(errorMessage);
      return false;
    } finally {
      setIsOperationLoading(false);
    }
  };

  const deleteDocument = async (fileId) => {
    try {
      setIsOperationLoading(true);
      const response = await deleteDocumentFromContext(contextId, fileId);
      if (response.status === 200) {
        showNotification('Document deleted successfully', 'success');
        setShouldFetch(true);
        await fetchContextDetail();
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = `Failed to delete document: ${err.message || 'Unknown error'}`;
      showNotification(errorMessage);
      return false;
    } finally {
      setIsOperationLoading(false);
    }
  };

  return { 
    context, 
    loading, 
    isOperationLoading,
    fetchContextDetail, 
    uploadDocument, 
    uploadDocumentText,
    deleteDocument 
  };
};