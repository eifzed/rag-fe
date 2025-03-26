import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import ContextSidebar from "./ContextSidebar";
import { useChat } from "../../hooks/useChat";
import { getContextById } from "../../services/api";
import { ErrorBoundary } from "react-error-boundary";
import { useNotification } from "../../contexts/NotificationContext";

const ChatWindow = ({ initialContextId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contextDetails, setContextDetails] = useState({
    name: "",
    description: "",
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
    resetChat,
  } = useChat(initialContextId);

  const needsContextSelection = !contextId;
  const inputRef = useRef(null);

  // Wrap in useCallback to prevent recreation on each render
  const getContextIdFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get("contextId");
  }, [location.search]);

  // Update URL with context ID - wrapped in useCallback
  const updateUrlWithContextId = useCallback((id) => {
    const params = new URLSearchParams(location.search);

    if (id) {
      params.set("contextId", id);
    } else {
      params.delete("contextId");
    }

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [location.pathname, location.search, navigate]);

  // Sync URL with context ID when initialized with initialContextId prop or from URL params
  useEffect(() => {
    const urlContextId = getContextIdFromUrl();

    if (initialContextId && initialContextId !== urlContextId) {
      updateUrlWithContextId(initialContextId);
    } else if (urlContextId && !contextId) {
      selectContext(urlContextId);
    }
  }, [initialContextId, contextId, getContextIdFromUrl, selectContext, updateUrlWithContextId]);

  // Update URL when context is selected
  useEffect(() => {
    if (contextId && contextId !== getContextIdFromUrl()) {
      updateUrlWithContextId(contextId);
    }

    // Fetch context details when contextId changes
    if (contextId) {
      fetchContextDetails(contextId);
    } else {
      setContextDetails({ name: "", description: "" });
    }
  }, [contextId, getContextIdFromUrl, updateUrlWithContextId]);

  // Focus input when loading state changes from true to false
  useEffect(() => {
    if (!loading && messages.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, messages]);

  const { showNotification } = useNotification();
  
  // Fetch context details from API
  const fetchContextDetails = async (id) => {
    try {
      const data = await getContextById(id);
      if (data) {
        setContextDetails({
          name: data.name || "",
          description: data.description || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch context details:", error);
      showNotification(`Failed to fetch context details: ${error.detail || 'Unknown error'}`, 'error');
    }
  };

  // Handle context selection with URL update
  const handleContextSelect = (id) => {
    selectContext(id);
    updateUrlWithContextId(id);
    showNotification(`Context "${id}" selected`, 'success');
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Handle chat reset with URL update
  const handleResetChat = () => {
    resetChat();
    if (inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 0);
    }
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
        <ErrorBoundary>
          <MessageInput
            onSendMessage={sendMessage}
            isLoading={loading}
            disabled={needsContextSelection}
            ref={inputRef}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ChatWindow;