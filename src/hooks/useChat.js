import { useState, useCallback, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

export const useChat = (initialContextId = null) => {
  const [contextId, setContextId] = useState(initialContextId);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sources, setSources] = useState([]);
  const { showNotification } = useNotification();

  // Function to generate a cache key for the current context
  const getCacheKey = useCallback((ctxId) => {
    return `chat_history_${ctxId || 'no_context'}`;
  }, []);
  
  // Load messages from cache when context changes
  useEffect(() => {
    if (contextId) {
      setMessages([]);
      setSources([]);
      
      // Then load from cache if available
      const cachedData = localStorage.getItem(getCacheKey(contextId));
      if (cachedData) {
        try {
          const { messages: cachedMessages, sources: cachedSources } = JSON.parse(cachedData);
          if (cachedMessages && cachedMessages.length > 0) {
            setMessages(cachedMessages);
          }
          if (cachedSources) {
            setSources(cachedSources);
          }
        } catch (e) {
          console.error("Failed to parse cached chat data:", e);
        }
      }
    } else {
      // No context selected, clear messages
      setMessages([]);
      setSources([]);
    }
  }, [contextId, getCacheKey]);
  
  // Save to cache whenever messages or sources change
  useEffect(() => {
    if (contextId && messages.length > 0) {
      const dataToCache = {
        messages,
        sources,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(getCacheKey(contextId), JSON.stringify(dataToCache));
    }
  }, [messages, sources, contextId, getCacheKey]);

  const sendMessage = useCallback(async (content) => {
    if (!contextId) {
      setError('Please select a context first');
      showNotification('Please select a context first', 'error');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Add user message to chat
      const userMessage = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);
      
      // Get only the last 6 messages (or all if less than 6)
      const lastMessages = [...messages, userMessage].slice(-6);
      
      // Format history for API
      const history = lastMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Send to API
      const response = await sendChatMessage(contextId, content, history);
      
      // Add assistant response to chat
      const assistantMessage = { 
        role: 'assistant', 
        content: response.response 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setSources(response.sources || []);
      
      return true;
    } catch (err) {
      const errorMessage = `Failed to send message: ${err.message || 'Unknown error'}`;
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [contextId, messages, showNotification]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setSources([]);
    setError(null);
    
    // Clear cache for this context
    if (contextId) {
      localStorage.removeItem(getCacheKey(contextId));
      showNotification('Chat history cleared', 'success');
    }
  }, [contextId, getCacheKey, showNotification]);

  const selectContext = useCallback((id) => {
    if (id !== contextId) {
      setContextId(id);
      setError(null);
    }
  }, [contextId]);


  return {
    messages,
    loading,
    error,
    sources,
    contextId,
    sendMessage,
    selectContext,
    resetChat,
  };
};