import Button from '../UI/Button';
import React, { useState } from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, documentName }) => {
    const [input, setInput] = useState('');
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
          <p className="text-gray-600 mb-2">
            Type the document name "{documentName}" to confirm deletion.
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter document name"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button 
              variant="danger" 
              onClick={() => input === documentName && onConfirm()}
              disabled={input !== documentName}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

export default ConfirmDeleteModal