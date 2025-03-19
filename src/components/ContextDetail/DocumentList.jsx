import React, { useState } from 'react';
import DocumentItem from './DocumentItem';
import Button from '../UI/Button';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import {downloadDocument} from "../../services/api"


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
  );
};

export default DocumentList;