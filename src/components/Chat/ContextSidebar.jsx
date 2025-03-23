import React from 'react';
import { useEffect, useState } from 'react';
import { getContexts } from '../../services/api';

const ContextSidebar = ({ isOpen, contextId, onSelectContext }) => {
  const [contextList, setContextList] = useState([]);
  
  // Fetch all contexts for the sidebar
  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const contexts = await getContexts();
        setContextList(contexts);
      } catch (error) {
        console.error("Failed to fetch contexts:", error);
      }
    };
    
    fetchContexts();
  }, []);

  return (
    <div className={`bg-gray-100 border-r border-gray-200 transition-all duration-300 ${
      isOpen ? 'w-64 md:w-72' : 'w-0 md:w-0'
    } overflow-hidden flex-shrink-0`}>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4">Available Contexts</h3>
        <div className="space-y-2">
          {contextList.length > 0 ? (
            contextList.map(context => (
              <div 
                key={context.id}
                onClick={() => onSelectContext(context.id)}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  contextId === context.id 
                    ? 'bg-blue-100 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-200'
                }`}
              >
                <h4 className="font-medium">
                  <a 
                    href={`/contexts/${context.id}`}
                    className="text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {context.name}
                  </a>
                </h4>
                {context.description && (
                  <p className="text-sm text-gray-600 truncate">{context.description}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">Loading contexts...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContextSidebar;