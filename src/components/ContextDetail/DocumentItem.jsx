import React from 'react';

const DocumentItem = ({ document, onDelete, onDownload }) => {
  // Status badge color mapping
  const statusConfig = {
    IN_QUEUE: { bg: 'bg-gray-100', text: 'text-gray-600' },
    PROCESSING: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    PROCESSING_FAILED: { bg: 'bg-red-100', text: 'text-red-600' },
    SUCCESS: { bg: 'bg-green-100', text: 'text-green-600' }
  };

  // Get the appropriate status styling, default to gray if status is undefined
  const status = document.upload_status || 'IN_QUEUE';
  const { bg, text } = statusConfig[status] || statusConfig.IN_QUEUE;

  return (
    <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4 mb-3 hover:bg-gray-50">
      <div className="flex items-center">
        <div className="bg-blue-100 text-blue-600 p-2 rounded mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{document.filename}</h4>
          <div className={`inline-flex items-center mt-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
            {document.upload_status || 'IN_QUEUE'}
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={() => onDownload(document.context_id, document.id)}
          className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
          disabled={document.upload_status !== 'SUCCESS'}
        >
          Download
        </button>
        <button 
          onClick={() => onDelete(document.id)}
          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DocumentItem;