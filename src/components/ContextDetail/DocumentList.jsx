import React, { useState } from "react";
import DocumentItem from "./DocumentItem";
import Button from "../UI/Button";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { downloadDocument } from "../../services/api";
import { ErrorBoundary } from "react-error-boundary";
import AddDocumentModal from "./AddDocumentModal";
import pdfIcon from "../../assets/pdf.png";
import textIcon from "../../assets/txt-file.png";
import mdIcon from "../../assets/file.png";
import scrapeIcon from "../../assets/typing.png";
import csvIcon from "../../assets/csv-file.png";
import otherIcon from "../../assets/google-docs.png";

const MAX_DOCUMENTS = Number(process.env.REACT_APP_MAX_DOCUMENTS) || 5;
const MAX_DOCUMENT_SIZE_MB = Number(process.env.MAX_DOCUMENT_SIZE_MB) || 5;

const DocumentList = ({ documents = [], onUpload, onDelete, isUploading }) => {
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDeleteRequest = (document) => {
    setFileToDelete(document);
  };

  const handleDownloadRequest = async (contextId, documentId) => {
    await downloadDocument(contextId, documentId);
  };

  const handleConfirmDelete = async () => {
    if (fileToDelete) {
      await onDelete(fileToDelete.id);
      setFileToDelete(null);
    }
  };

  const handleDocumentAdded = async (file, data) => {
    await onUpload(file, data);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
  };

  const getIconForType = (contentType) => {
    switch (contentType) {
      case "application/pdf":
        return pdfIcon;
      case "text/plain":
        return textIcon;
      case "text/csv":
        return csvIcon;
      case "text/markdown":
        return mdIcon;
      case "text/url-scrape":
        return scrapeIcon;
      default:
        return otherIcon;
    }
  };

  const displayedDocuments = documents.slice(0, MAX_DOCUMENTS);
  const emptySlots = MAX_DOCUMENTS - displayedDocuments.length;
  const canUpload = displayedDocuments.length < MAX_DOCUMENTS;

  return (
    <ErrorBoundary>
      <div className="mt-6">
        <ConfirmDeleteModal
          isOpen={!!fileToDelete}
          onClose={() => setFileToDelete(null)}
          onConfirm={handleConfirmDelete}
          documentName={fileToDelete?.filename || ""}
        />

        <AddDocumentModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onUpload={handleDocumentAdded}
        />

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-lg font-medium text-gray-700 mr-4">
              Documents
            </span>
            <div className="relative inline-block">
              <button
                className="text-gray-500 hover:text-blue-500"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {showTooltip && (
                <div className="absolute z-10 w-64 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2">
                  Upload up to {MAX_DOCUMENTS} Documents with each max size of {MAX_DOCUMENT_SIZE_MB}MB to be integrated with
                  this context. Only documents with status SUCCESS is included in the chat
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            disabled={!canUpload || isUploading}
          >
            {isUploading ? "Uploading..." : "Add Document"}
          </Button>
        </div>

        {displayedDocuments.map((doc) => (
          <DocumentItem
            key={doc.id}
            document={doc}
            onDelete={() => handleDeleteRequest(doc)}
            onDownload={() => handleDownloadRequest(doc.context_id, doc.id)}
            icon={getIconForType(doc.content_type)}
          />
        ))}

        {[...Array(emptySlots)].map((_, index) => (
          <div
            key={`empty-${index}`}
            className="flex justify-between items-center bg-gray-100 rounded-lg p-4 mb-3 text-gray-400"
          >
            <div>Available Document Slot</div>
          </div>
        ))}
      </div>
    </ErrorBoundary>
  );
};

export default DocumentList;
