import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const ContextItem = ({ context, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = context.created_at 
    ? formatDistanceToNow(new Date(context.created_at), { addSuffix: true })
    : 'Unknown date';

  const handleDelete = async () => {
    if (confirmInput !== context.name) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`http://localhost:8000/api/contexts/${context.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        if (onDelete) onDelete(context.id);
        setShowDeleteConfirm(false);
      } else {
        console.error('Failed to delete context');
      }
    } catch (error) {
      console.error('Error deleting context:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{context.name}</h3>
          <p className="text-gray-600 mb-2">{context.description}</p>
          <p className="text-sm text-gray-500">Created {formattedDate}</p>
        </div>
        <div className="flex space-x-2">
          <Link 
            to={`/contexts/${context.id}`}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm"
          >
            View Details
          </Link>
          <Link 
            to={`/chat?contextId=${context.id}`}
            className="px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 text-sm"
          >
            Chat
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Delete context"
          >
            {/* Simple trash icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete <span className="font-semibold">{context.name}</span>? 
              This action cannot be undone.
            </p>
            <p className="mb-2 text-sm">Type <span className="font-semibold">{context.name}</span> to confirm:</p>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder={`Type "${context.name}" to confirm`}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setConfirmInput('');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`px-4 py-2 rounded text-white ${
                  confirmInput === context.name
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-300 cursor-not-allowed'
                }`}
                disabled={confirmInput !== context.name || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextItem;