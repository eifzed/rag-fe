// src/components/ContextList/ContextItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const ContextItem = ({ context }) => {
  const formattedDate = context.created_at 
    ? formatDistanceToNow(new Date(context.created_at), { addSuffix: true })
    : 'Unknown date';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{context.name}</h3>
          <p className="text-gray-600 mb-2">{context.description}</p>
          <p className="text-sm text-gray-500">Created {formattedDate}</p>
        </div>
        <div className="flex space-x-2">
          <Link 
            to={`/contexts/${context.id}`}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm"
          >
            View Details
          </Link>
          <Link 
            to={`/chat?contextId=${context.id}`}
            className="px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 text-sm"
          >
            Chat
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContextItem;