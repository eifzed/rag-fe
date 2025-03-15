// src/pages/ChatPage.jsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatWindow from '../components/Chat/ChatWindow';

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const contextId = searchParams.get('contextId');
  
  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatWindow initialContextId={contextId} />
    </div>
  );
};

export default ChatPage;