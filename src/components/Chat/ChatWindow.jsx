import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import ContextSidebar from './ContextSidebar';
import { useChat } from '../../hooks/useChat';
import { getContextById } from '../../services/api';

const ChatWindow = ({ initialContextId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contextDetails, setContextDetails] = useState({
    name: '',
    description: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const {
    messages,
    loading,
    error,
    sources,
    contextId,
    sendMessage,
    selectContext,
    resetChat
  } = useChat(initialContextId);
  
  const needsContextSelection = !contextId;

  // Sync URL with context ID when initialized with initialContextId prop
  useEffect(() => {
    if (initialContextId && initialContextId !== getContextIdFromUrl()) {
      updateUrlWithContextId(initialContextId);
    }
  }, [initialContextId]);

  // Update URL when context is selected
  useEffect(() => {
    if (contextId && contextId !== getContextIdFromUrl()) {
      updateUrlWithContextId(contextId);
    }
    
    // Fetch context details when contextId changes
    if (contextId) {
      fetchContextDetails(contextId);
    } else {
      setContextDetails({ name: '', description: '' });
    }
  }, [contextId]);

  // Fetch context details from API
  const fetchContextDetails = async (id) => {
    try {
      const data = await getContextById(id)
      if (data) {
        setContextDetails({
          name: data.name || '',
          description: data.description || ''
        });
      }
    } catch (error) {
      console.error("Failed to fetch context details:", error);
    }
  };

  // Extract context ID from URL
  const getContextIdFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('contextId');
  };

  // Update URL with context ID
  const updateUrlWithContextId = (id) => {
    const params = new URLSearchParams(location.search);
    
    if (id) {
      params.set('contextId', id);
    } else {
      params.delete('contextId');
    }
    
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Handle context selection with URL update
  const handleContextSelect = (id) => {
    selectContext(id);
    updateUrlWithContextId(id);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Handle chat reset with URL update
  const handleResetChat = () => {
    resetChat();
    // Optionally keep the context in URL when resetting chat
    // If you want to clear context on reset, uncomment:
    // updateUrlWithContextId(null);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-full">
      {/* Context Sidebar */}
      <ContextSidebar 
        isOpen={sidebarOpen}
        contextId={contextId}
        onSelectContext={handleContextSelect}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-grow overflow-hidden">
        <ChatHeader 
          contextDetails={contextDetails}
          contextId={contextId}
          toggleSidebar={toggleSidebar}
          handleResetChat={handleResetChat}
          handleContextSelect={handleContextSelect}
          needsContextSelection={needsContextSelection}
          sidebarOpen={sidebarOpen}
          messages={messages}
          error={error}
        />
        
        <MessageList messages={messages} sources={sources} />
        
        <MessageInput 
          onSendMessage={sendMessage}
          isLoading={loading}
          disabled={needsContextSelection}
        />
      </div>
    </div>
  );
};

export default ChatWindow;