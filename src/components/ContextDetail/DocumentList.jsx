import React, { useState } from 'react';
import DocumentItem from './DocumentItem';
import Button from '../UI/Button';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {downloadDocument} from "../../services/api"
import { ErrorBoundary } from 'react-error-boundary';


const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
      <h3 className="text-lg font-medium text-red-800">Something went wrong:</h3>
      <p className="text-red-600 mt-1">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
      >
        Try again
      </button>
    </div>
  );
};

const DocumentList = ({ documents = [], onUpload, onDelete, isUploading }) => {
  const [fileToDelete, setFileToDelete] = useState(null);

  const handleDeleteRequest = (document) => {
    setFileToDelete(document);
  };

  const handleDownloadRequest = async (documentId) => {
    downloadDocument(documentId)
  }

  const handleConfirmDelete = async () => {
    if (fileToDelete) {
      await onDelete(fileToDelete.id);
      setFileToDelete(null);
    }
  };

  return (
    <ErrorBoundary>
      <div className="mt-6">
        <ConfirmDeleteModal 
          isOpen={!!fileToDelete} 
          onClose={() => setFileToDelete(null)} 
          onConfirm={handleConfirmDelete} 
          documentName={fileToDelete?.filename || ''} 
        />
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Documents</h3>
          <Button
            onClick={() => document.getElementById('fileInput').click()}
            variant="primary"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Add Document'}
          </Button>
          <input
            type="file"
            accept='.pdf,.csv,.doc,.txt,.md'
            id="fileInput"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onUpload(e.target.files[0]);
                e.target.value = null;
              }
            }}
          />
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No documents yet. Add some to get started.</p>
          </div>
        ) : (
          documents.map((doc) => (
            <DocumentItem key={doc.id} document={doc} onDelete={() => handleDeleteRequest(doc)} onDownload={() => handleDownloadRequest(doc.id)}/>
          ))
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DocumentList;