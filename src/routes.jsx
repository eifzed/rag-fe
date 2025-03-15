// src/routes.jsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ContextsPage from './pages/ContextsPage';
import ContextDetailPage from './pages/ContextDetailPage';
import ChatPage from './pages/ChatPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <ContextsPage />
      },
      {
        path: 'contexts',
        element: <ContextsPage />
      },
      {
        path: 'contexts/:contextId',
        element: <ContextDetailPage />
      },
      {
        path: 'chat',
        element: <ChatPage />
      }
    ]
  }
]);

export default router;