import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContextDetail } from '../../hooks/useContextDetail';
import DocumentList from './DocumentList';
import LoadingSpinner from '../UI/LoadingSpinner';
import Button from '../UI/Button';
import { formatDistanceToNow } from 'date-fns';

const ContextDetail = ({ contextId }) => {
  const { 
    context, 
    loading, 
    error, 
    uploadDocument, 
    uploadDocumentText,
    deleteDocument 
  } = useContextDetail(contextId);
  
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (file, data) => {
    setIsUploading(true);
    try {
      if (file) {
        await uploadDocument(file);
      } else{
        await uploadDocumentText(data);
      }
      
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    await deleteDocument(fileId);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/contexts')} 
          className="text-red-700 font-medium mt-2 underline"
        >
          Return to Context List
        </button>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Context not found.</p>
        <Link to="/contexts" className="text-blue-500 font-medium mt-2 block">
          Return to Context List
        </Link>
      </div>
    );
  }

  const formattedDate = context.created_at 
    ? formatDistanceToNow(new Date(context.created_at), { addSuffix: true })
    : 'Unknown date';

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link 
          to="/contexts" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Contexts
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{context.name}</h2>
            <p className="text-gray-600 mt-1">{context.description}</p>
            <p className="text-sm text-gray-500 mt-2">Created {formattedDate}</p>
          </div>
          <Link to={`/chat?contextId=${context.id}`}>
            <Button variant="success">
              Chat with this Context
            </Button>
          </Link>
        </div>

        <DocumentList 
          documents={context.files} 
          onUpload={handleUpload}
          onDelete={handleDelete}
          isUploading={isUploading}
        />
      </div>
    </div>
  );
};

export default ContextDetail;