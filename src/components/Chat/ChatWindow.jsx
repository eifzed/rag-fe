// src/components/Chat/ChatWindow.jsx (continued)
import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ContextSelector from './ContextSelector';
import { useChat } from '../../hooks/useChat';
import Button from '../UI/Button';

const ChatWindow = ({ initialContextId }) => {
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

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {contextId ? 'Chat with AI Assistant' : 'Select a Context'}
          </h2>
          {messages.length > 0 && (
            <Button onClick={resetChat} variant="secondary" size="sm">
              New Chat
            </Button>
          )}
        </div>
        
        {needsContextSelection && (
          <div className="mt-4">
            <ContextSelector 
              onSelectContext={selectContext}
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
      
      <MessageList messages={messages} sources={sources} />
      
      <MessageInput 
        onSendMessage={sendMessage}
        isLoading={loading}
        disabled={needsContextSelection}
      />
    </div>
  );
};

export default ChatWindow;