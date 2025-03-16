import React from 'react';

const DocumentItem = ({ document, onDelete }) => {
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
        </div>
      </div>
      <div className="flex space-x-2">
        <a 
          href={document.download_link} 
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
        >
          View
        </a>
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