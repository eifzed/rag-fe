import React, { useState, forwardRef } from 'react';
import Button from '../UI/Button';

const MessageInput = forwardRef(({ onSendMessage, isLoading, disabled }, ref) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  // Handle Enter key press - submit on Shift+Enter, new line on Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex">
        <textarea
          ref={ref}
          className="flex-1 border rounded-l-lg px-4 py-3 min-h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          rows={3}
        />
        <Button
          type="submit"
          variant="primary"
          className="rounded-l-none self-stretch flex items-center"
          disabled={!message.trim() || isLoading || disabled}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Press Shift+Enter for a new line, Enter to send
      </div>
    </form>
  );
});

export default MessageInput;