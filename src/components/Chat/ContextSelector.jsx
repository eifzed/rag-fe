// src/components/Chat/ContextSelector.jsx
import React, { useState, useEffect } from 'react';
import { getContexts } from '../../services/api';

const ContextSelector = ({ onSelectContext, selectedContextId }) => {
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContexts = async () => {
      try {
        setLoading(true);
        const data = await getContexts();
        setContexts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load contexts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContexts();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading contexts...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select a context to chat with:
      </label>
      <select
        className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedContextId || ''}
        onChange={(e) => onSelectContext(e.target.value)}
      >
        <option value="" disabled>
          -- Select a context --
        </option>
        {contexts.map((context) => (
          <option key={context.id} value={context.id}>
            {context.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ContextSelector;