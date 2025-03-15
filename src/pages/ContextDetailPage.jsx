// src/pages/ContextDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ContextDetail from '../components/ContextDetail/ContextDetail';

const ContextDetailPage = () => {
  const { contextId } = useParams();
  
  return (
    <div className="flex-1">
      <ContextDetail contextId={contextId} />
    </div>
  );
};

export default ContextDetailPage;