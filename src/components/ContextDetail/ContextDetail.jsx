import React from 'react';
import { Link } from 'react-router-dom';
import { useContextDetail } from '../../hooks/useContextDetail';
import DocumentList from './DocumentList';
import LoadingSpinner from '../UI/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import chatIcon from '../../assets/new_chat_button.png';
import { useNotification } from '../../contexts/NotificationContext';

const ContextDetail = ({ contextId }) => {
  const { 
    context, 
    loading, 
    isOperationLoading,
    uploadDocument, 
    uploadDocumentText,
    deleteDocument 
  } = useContextDetail(contextId);
  
  const { showNotification } = useNotification();

  const handleUpload = async (file, data) => {
    try {
      if (file) {
        await uploadDocument(file);
      } else {
        await uploadDocumentText(data);
      }
    } catch (err) {
      showNotification('An error occurred while uploading the document');
      console.error('Upload error:', err);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteDocument(fileId);
    } catch (err) {
      showNotification('An error occurred while deleting the document');
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
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
          <Link to={`/chat?contextId=${context.id}`} className="relative group">
            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer shadow-md transition-transform transform hover:scale-110">
              <img src={chatIcon} alt="Chat Icon" className="w-14 h-14" />
            </div>
            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-3 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap w-48 text-center">
              Chat with this Context
            </span>
          </Link>
        </div>

        <DocumentList 
          documents={context.files} 
          onUpload={handleUpload}
          onDelete={handleDelete}
          isUploading={isOperationLoading}
        />
      </div>
    </div>
  );
};

export default ContextDetail;