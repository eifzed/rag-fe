import React from 'react';

const DocumentItem = ({ document, onDelete, onDownload, icon }) => {
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
      <div className="flex items-center">
      <img src={icon} alt="Document Icon" className="w-6 h-6 mr-3" />
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