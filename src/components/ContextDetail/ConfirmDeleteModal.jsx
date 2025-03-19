import Button from '../UI/Button';
import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, documentName }) => {
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete document "{documentName}"?  
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button 
              variant="danger" 
              onClick={onConfirm}
            >
              Yes
            </Button>
          </div>
        </div>
      </div>
    );
  };

export default ConfirmDeleteModal