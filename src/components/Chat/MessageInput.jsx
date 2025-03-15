// src/components/Chat/MessageInput.jsx
import React, { useState } from 'react';
import Button from '../UI/Button';

const MessageInput = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled || isLoading}
        />
        <Button
          type="submit"
          variant="primary"
          className="rounded-l-none"
          disabled={!message.trim() || isLoading || disabled}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;