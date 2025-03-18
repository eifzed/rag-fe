// src/components/ProtectedRoute.jsx
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { checkAuthStatus } from '../utils/auth';

const ProtectedRoute = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = await checkAuthStatus();
      setIsAuthorized(authenticated);
      setIsChecking(false);
    };

    verifyAuth();
  }, []);

  if (isChecking) {
    // You could show a loading spinner here
    return <div>Loading...</div>;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;