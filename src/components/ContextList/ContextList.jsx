import React, { useState } from 'react';
import ContextItem from './ContextItem';
import { useContexts } from '../../hooks/useContexts';
import SearchBar from '../UI/SearchBar';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import LoadingSpinner from '../UI/LoadingSpinner';

const ContextList = () => {
  const { 
    contexts, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    fetchContexts, 
    addContext 
  } = useContexts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContext, setNewContext] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCreateContext = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await addContext(newContext.name, newContext.description);
      if (success) {
        setIsModalOpen(false);
        setNewContext({ name: '', description: '' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Knowledge Contexts</h2>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          Create New Context
        </Button>
      </div>
      
      <SearchBar 
        value={searchTerm} 
        onChange={handleSearch} 
        onSearch={fetchContexts}
        placeholder="Search contexts..." 
      />
      
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      ) : contexts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No contexts found. Create a new one to get started.</p>
        </div>
      ) : (
        <div className="mt-6">
          {contexts.map(context => (
            <ContextItem key={context.id} context={context} />
          ))}
        </div>
      )}
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Context"
      >
        <form onSubmit={handleCreateContext}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Context Name
            </label>
            <input
              id="name"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newContext.name}
              onChange={(e) => setNewContext({...newContext, name: e.target.value})}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newContext.description}
              onChange={(e) => setNewContext({...newContext, description: e.target.value})}
              rows="3"
              required
            />
          </div>
          <div className="flex items-center justify-end">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Context'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContextList;