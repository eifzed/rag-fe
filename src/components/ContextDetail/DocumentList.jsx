import React, { useState } from 'react';
import DocumentItem from './DocumentItem';
import Button from '../UI/Button';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {downloadDocument} from "../../services/api"
import { ErrorBoundary } from 'react-error-boundary';
import AddDocumentModal from './AddDocumentModal';


const DocumentList = ({ documents = [], onUpload, onDelete, isUploading }) => {
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDeleteRequest = (document) => {
    setFileToDelete(document);
  };

  const handleDownloadRequest = async (contextId, documentId) => {
    downloadDocument(contextId, documentId);
  };

  const handleConfirmDelete = async () => {
    if (fileToDelete) {
      await onDelete(fileToDelete.id);
      setFileToDelete(null);
    }
  };

  const handleDocumentAdded = (file, data) => {
    onUpload(file, data);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
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
        
        <AddDocumentModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onUpload={handleDocumentAdded}
        />
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Documents</h3>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Add Document'}
          </Button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No documents yet. Add some to get started.</p>
          </div>
        ) : (
          documents.map((doc) => (
            <DocumentItem 
              key={doc.id} 
              document={doc} 
              onDelete={() => handleDeleteRequest(doc)} 
              onDownload={() => handleDownloadRequest(doc.context_id, doc.id)}
            />
          ))
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DocumentList;