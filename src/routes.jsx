// src/routes.jsx
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import ContextsPage from './pages/ContextsPage';
import ContextDetailPage from './pages/ContextDetailPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage'; // You'll need to create this
import SignupPage from './pages/SignupPage';

// Auth protection wrapper component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path:'login',
        element: <LoginPage/>
      },
      {
        path: 'signup',
        element: <SignupPage />
      },
      {
        index: true,
        element: <ProtectedRoute><ContextsPage /></ProtectedRoute>
      },
      {
        path: 'contexts',
        element: <ProtectedRoute><ContextsPage /></ProtectedRoute>
      },
      {
        path: 'contexts/:contextId',
        element: <ProtectedRoute><ContextDetailPage /></ProtectedRoute>
      },
      {
        path: 'chat/:contextId',
        element: <ProtectedRoute><ChatPage /></ProtectedRoute>
      },
      {
        path: 'chat/',
        element: <ProtectedRoute><ChatPage /></ProtectedRoute>
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default router;