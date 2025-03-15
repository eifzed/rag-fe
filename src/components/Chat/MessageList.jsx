// src/components/Chat/MessageList.jsx
import React, { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages, sources = [] }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
            <p>Ask a question about the selected context</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageItem key={index} message={message} />
          ))}
          {sources.length > 0 && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
            <div className="mt-2 mb-4 bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500 font-medium mb-1">Sources:</p>
              <ul className="text-sm text-gray-500 list-disc pl-5">
                {sources.map((source, idx) => (
                  <li key={idx}>{source}</li>
                ))}
              </ul>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;