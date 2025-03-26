// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/UI/Navbar';
import axios from 'axios';
import { checkAuthStatus } from './utils/auth';
import { removeAuth } from './utils/auth';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const currentPath = window.location.pathname;
  const isPublicRoute = currentPath === '/login' || currentPath === '/signup' || currentPath === '/';

  // Verify token with backend on load
  useEffect(() => {
    const verifyAuth = async () => {
      if (!isPublicRoute) {
        const isValid = await checkAuthStatus();
        setIsAuthenticated(isValid);
        
        if (!isValid) {
          navigate('/login');
        }
      }
      setIsLoading(false);
    };
    
    verifyAuth();
  }, [navigate, isPublicRoute]);

  // Setup axios interceptor for auth errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          removeAuth();
          setIsAuthenticated(false);
          
          // Only navigate if not already on login or signup
          const currentPath = window.location.pathname;
          if (currentPath !== '/login' && currentPath !== '/signup') {
            navigate('/login');
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  // Create a method to update authentication status (to pass to login/signup components)
  const handleAuthChange = (status) => {
    setIsAuthenticated(status);
  };

  // Show loading state while checking authentication
  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Add auth context to make authentication state available to all components
  return (
    <NotificationProvider>
      <div className="flex flex-col h-screen">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={handleAuthChange} />
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          {/* Pass auth state and setter to all child routes */}
          <Outlet context={{ isAuthenticated, setIsAuthenticated: handleAuthChange }} />
        </main>
      </div>
    </NotificationProvider>
  );
}

export default App;