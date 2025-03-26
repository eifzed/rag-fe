import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import ContextSelector from './ContextSelector';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'react-feather';
import { useNotification } from '../../contexts/NotificationContext';
import ConfirmationDialog from '../UI/ConfirmationDialog';

const ChatHeader = ({ 
  contextDetails, 
  contextId, 
  toggleSidebar, 
  handleResetChat, 
  handleContextSelect,
  needsContextSelection,
  sidebarOpen,
  messages,
  error 
}) => {
  const { showNotification } = useNotification();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleClearChat = () => {
    handleResetChat();
    showNotification('Chat history cleared', 'success');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white border-b p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Toggle context sidebar"
          >
            <Menu size={24} />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {contextId ? (
                <span className="flex items-center">
                  Chat: <span className="mx-1"></span>
                  <Link 
                    to={`/contexts/${contextId}`} 
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    {contextDetails.name || 'Loading context...'}
                    <ExternalLink size={16} className="ml-1" />
                  </Link>
                </span>
              ) : 'Select a Context'}
            </h2>

            {contextDetails.description && (
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">{contextDetails.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3 relative">
          {messages.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors relative group mr-4"
              aria-label="Clear chat history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
              <span className="absolute top-full mt-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Clear chat history
              </span>
            </button>
          )}
        </div>
      </div>
      
      {needsContextSelection && !sidebarOpen && (
        <div className="mt-4">
          <ContextSelector 
            onSelectContext={handleContextSelect}
            selectedContextId={contextId}
          />
        </div>
      )}
      
      {error && (
        <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3" role="alert">
          <p>{error}</p>
        </div>
      )}

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleClearChat}
        title="Confirm Deletion"
        message="Are you sure you want to clear the chat history? This action cannot be undone."
      />
    </div>
  );
};

export default ChatHeader;