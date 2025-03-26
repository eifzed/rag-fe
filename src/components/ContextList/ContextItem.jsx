import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { deleteContext } from '../../services/api';
import chatIcon from '../../assets/new_chat_button.png';

const ContextItem = ({ context, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const formattedDate = context.created_at 
    ? formatDistanceToNow(new Date(context.created_at), { addSuffix: true })
    : 'Unknown date';

  const handleDelete = async () => {
    if (confirmInput !== context.name) return;
    
    try {
      setIsDeleting(true);
      const isDeleted = await deleteContext(context.id);

      if (isDeleted) {
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 mr-3">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{context.name}</h3>
          <p className="text-gray-600 mb-2 line-clamp-2 overflow-hidden text-ellipsis" title={context.description}>
            {context.description}
          </p>
          <p className="text-sm text-gray-500">Created {formattedDate}</p>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
          <Link 
            to={`/chat?contextId=${context.id}`}
            className="p-2 md:p-3 text-green-600 hover:bg-green-50 rounded-md transition-colors relative group"
            aria-label="Chat with this context"
          >
            <img src={chatIcon} alt="Chat" className="w-5 h-5 md:w-6 md:h-6" />
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Chat with this context
            </span>
          </Link>
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 md:p-2.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="More options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                <Link 
                  to={`/contexts/${context.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  View Details
                </Link>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
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