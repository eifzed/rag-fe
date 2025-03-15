// src/hooks/useChat.js
import { useState, useCallback } from 'react';
import { sendChatMessage } from '../services/api';

export const useChat = (initialContextId = null) => {
  const [contextId, setContextId] = useState(initialContextId);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sources, setSources] = useState([]);

  const sendMessage = useCallback(async (content) => {
    if (!contextId) {
      setError('Please select a context first');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Add user message to chat
      const userMessage = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);
      
      // Format history for API
      const history = messages.map(msg => ({
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
      setError('Failed to send message');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [contextId, messages]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setSources([]);
    setError(null);
  }, []);

  const selectContext = useCallback((id) => {
    setContextId(id);
    resetChat();
  }, [resetChat]);

  return {
    messages,
    loading,
    error,
    sources,
    contextId,
    sendMessage,
    selectContext,
    resetChat
  };
};