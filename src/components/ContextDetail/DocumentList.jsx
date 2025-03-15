// src/components/ContextDetail/DocumentList.jsx
import React, { useRef, useState } from 'react';
import DocumentItem from './DocumentItem';
import Button from '../UI/Button';

const DocumentList = ({ documents = [], onUpload, onDelete, isUploading }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file) => {
    if (file) {
      onUpload(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Documents</h3>
        <Button
          onClick={() => fileInputRef.current.click()}
          variant="primary"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Add Document'}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
              e.target.value = null; // Reset input
            }
          }}
        />
      </div>

      <div 
        className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <p className="text-gray-500">
          {dragActive 
            ? 'Drop file here to upload' 
            : 'Drag and drop a file here, or click "Add Document" to upload'}
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No documents yet. Add some to get started.</p>
        </div>
      ) : (
        documents.map((doc) => (
          <DocumentItem key={doc.id} document={doc} onDelete={onDelete} />
        ))
      )}
    </div>
  );
};

export default DocumentList;