import React, { useState } from 'react';
import Button from '../UI/Button';
import { scrapeUrl } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';

const AddDocumentModal = ({ isOpen, onClose, onUpload }) => {
  const [activeTab, setActiveTab] = useState('file');
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [showUrlScraper, setShowUrlScraper] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { showNotification } = useNotification();
  
  // Character limit constant
  const CONTENT_CHAR_LIMIT = process.env.CONTENT_CHAR_LIMIT || 50000;

  if (!isOpen) return null;

  // Check if content exceeds character limit
  const isContentOverLimit = content.length > CONTENT_CHAR_LIMIT;

  // Calculate remaining characters
  const remainingChars = CONTENT_CHAR_LIMIT - content.length;

  const handleFileUpload = async(e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const success = await onUpload(e.target.files[0], null);
        if (success) {
          onClose(true);
        }
      } catch (err) {
        showNotification('Failed to upload file:'+ (err.detail || 'Unknown error'));
        
      }finally {
        setIsUploading(false);
      }
    }
  };

  const handleScrapeUrl = async () => {
    if (!url) {
      showNotification('Please enter a URL');
      return;
    }

    setIsScraping(true);
    
    try {
      const response = await scrapeUrl(url);
      if (response && response.content) {
        if (!name && response.url) {
          setName(response.url);
        }
        const content = `**from: ${response.url}**\n${response.content}\n`
        setContent(prev => prev ? prev + "\n" + content : content);
      }
    } catch (err) {
      showNotification('Failed to scrape URL: ' + (err.message || 'Unknown error'));
    } finally {
      setIsScraping(false);
    }
  };

  const handleUploadText = async () => {
    if (!name || !content) {
      showNotification('Please provide both name and content');
      return;
    }

    if (isContentOverLimit) {
      showNotification(`Content exceeds the ${CONTENT_CHAR_LIMIT} character limit`);
      return;
    }

    setIsUploading(true);
    
    try {
        const success = await onUpload(null, {
            filename: name,
            content_type: "text/url-scrape",
            content: content
        });
        if (success) {
            onClose(true);
        }
    } catch (err) {
      showNotification('Failed to add document: ' + (err.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Document</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 ${activeTab === 'file' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('file')}
          >
            Upload File
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'text' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('text')}
          >
            Text Input
          </button>
        </div>

        {activeTab === 'file' ? (
          <div className="text-center py-8">
            <p className="mb-4 text-gray-600">Select a file to upload</p>
            <Button
              onClick={() => document.getElementById('modalFileInput').click()}
              variant="primary"
            >
              Choose File
            </Button>
            <input
              type="file"
              accept='.pdf,.txt,.md'
              id="modalFileInput"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* URL Scraper Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Enable URL Scraper</span>
                <div className="relative inline-block">
                  <button
                    className="text-gray-500 hover:text-blue-500"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showTooltip && (
                    <div className="absolute z-10 w-64 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2">
                      URL Scraper allows you to extract content from a webpage. Enter a URL, click "Scrape", and the content will be added to your document. The URL will be used as the document name if left empty.
                      <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  )}
                </div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  value="" 
                  className="sr-only peer" 
                  checked={showUrlScraper}
                  onChange={() => setShowUrlScraper(!showUrlScraper)}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {/* URL Scraper Input (conditionally rendered) */}
            <div>
              <label className={`block text-sm font-medium ${showUrlScraper ? 'text-gray-700' : 'text-gray-400'} mb-1`}>URL to Scrape</label>
              <div className="flex">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className={`flex-1 p-2 border rounded-l focus:ring-blue-500 focus:border-blue-500 ${!showUrlScraper && 'bg-gray-100 text-gray-400'}`}
                  disabled={!showUrlScraper}
                />
                <Button
                  onClick={handleScrapeUrl}
                  variant="secondary"
                  className="rounded-l-none"
                  disabled={isUploading || isScraping || !showUrlScraper}
                >
                  {isScraping ? 'Scraping...' : 'Scrape'}
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter document name"
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter or paste content here"
                  rows={8}
                  className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${isContentOverLimit ? 'border-red-500' : ''}`}
                />
                {content.length > 0 && (
                  <div className={`text-sm mt-1 flex justify-end ${isContentOverLimit ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                    {remainingChars} characters remaining
                  </div>
                )}
                {isContentOverLimit && (
                  <div className="text-sm text-red-500 mt-1">
                    Content exceeds maximum character limit
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleUploadText}
                variant="primary"
                disabled={isUploading || isScraping || isContentOverLimit || !name || !content}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDocumentModal;