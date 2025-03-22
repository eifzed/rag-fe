// src/routes.jsx
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import ContextsPage from './pages/ContextsPage';
import ContextDetailPage from './pages/ContextDetailPage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage'; // You'll need to create this
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import { checkAuthStatus } from './utils/auth';
import { ErrorBoundary } from 'react-error-boundary';

// Auth protection wrapper component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = checkAuthStatus();
  
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
        index: true,
        element: <LandingPage />
      },
      {
        path:'login',
        element: <ErrorBoundary><LoginPage/></ErrorBoundary>
      },
      {
        path: 'signup',
        element: <ErrorBoundary><SignupPage /></ErrorBoundary>
      },
      {
        index: true,
        element: <ProtectedRoute><ContextsPage /></ProtectedRoute>
      },
      {
        path: 'contexts',
        element: <ErrorBoundary><ProtectedRoute><ContextsPage /></ProtectedRoute></ErrorBoundary>
      },
      {
        path: 'contexts/:contextId',
        element: <ErrorBoundary><ProtectedRoute><ContextDetailPage /></ProtectedRoute></ErrorBoundary>
      },
      {
        path: 'chat/:contextId',
        element: <ErrorBoundary><ProtectedRoute><ChatPage /></ProtectedRoute></ErrorBoundary>
      },
      {
        path: 'chat/',
        element: <ErrorBoundary><ProtectedRoute><ChatPage /></ProtectedRoute></ErrorBoundary>
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default router;