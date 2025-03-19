import React from 'react';
import { Menu } from 'lucide-react';
import Button from '../UI/Button';
import ContextSelector from './ContextSelector';

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
                <span>
                  Chat: <span className="text-blue-600">{contextDetails.name || 'Loading context...'}</span>
                </span>
              ) : 'Select a Context'}
            </h2>
            {contextDetails.description && (
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">{contextDetails.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {messages.length > 0 && (
            <Button onClick={handleResetChat} variant="secondary" size="sm">
              Clear Chat
            </Button>
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
    </div>
  );
};

export default ChatHeader;