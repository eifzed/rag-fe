import React from 'react';

const DocumentItem = ({ document, onDelete, onDownload, icon, isDeleteModalActive }) => {
  // Status badge color mapping
  const statusConfig = {
    'IN QUEUE': { bg: 'bg-gray-100', text: 'text-gray-600' },
    'PROCESSING': { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    'FAILED': { bg: 'bg-red-100', text: 'text-red-600' },
    'SUCCESS': { bg: 'bg-green-100', text: 'text-green-600' }
  };

  // Get the appropriate status styling, default to gray if status is undefined
  const status = document.upload_status || 'IN_QUEUE';
  const { bg, text } = statusConfig[status] || statusConfig.IN_QUEUE;

  return (
    <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4 mb-3 hover:bg-gray-50">
      <div className="flex items-center flex-grow min-w-0 mr-4">
        <img src={icon} alt="Document Icon" className="w-6 h-6 mr-3 flex-shrink-0" />
        <div className="min-w-0">
          <h4 className="font-medium text-gray-800 truncate" title={document.filename}>
            {document.filename}
          </h4>
          <div className={`inline-flex items-center mt-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
            {document.upload_status || 'IN_QUEUE'}
          </div>
        </div>
      </div>
      <div className="flex space-x-2 flex-shrink-0">
        <button 
          onClick={() => onDownload(document.context_id, document.id)}
          className={`p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors relative group ${isDeleteModalActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Download document"
          disabled={isDeleteModalActive}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span className="absolute top-full mt-1 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            Download document
          </span>
        </button>
        <button 
          onClick={() => onDelete(document.id)}
          className={`p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors relative group ${isDeleteModalActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Delete document"
          disabled={isDeleteModalActive}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
          <span className="absolute top-full mt-1 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            Delete document
          </span>
        </button>
      </div>
    </div>
  );
};

export default DocumentItem;