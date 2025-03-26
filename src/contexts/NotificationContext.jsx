import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, notification.duration || 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle animation end to clean up notification state
  const handleTransitionEnd = () => {
    if (!isVisible) {
      setNotification(null);
    }
  };

  const showNotification = (message, type = 'error', duration = 5000) => {
    // If there's already a notification, hide it first
    if (notification) {
      setIsVisible(false);
      // Small delay to allow the exit animation to complete
      setTimeout(() => {
        setNotification({ message, type, duration });
      }, 300);
    } else {
      setNotification({ message, type, duration });
    }
  };

  const hideNotification = () => {
    setIsVisible(false);
  };

  // Icon mapping for different notification types
  const getIcon = () => {
    if (notification?.type === 'error') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (notification?.type === 'success') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else if (notification?.type === 'warning') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    } else if (notification?.type === 'info') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        {notification && (
          <div className={`mx-auto max-w-md p-3 ${
            notification.type === 'error' ? 'bg-red-500' : 
            notification.type === 'success' ? 'bg-green-500' : 
            notification.type === 'warning' ? 'bg-amber-500' : 
            notification.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
          } text-white shadow-lg rounded-b-md`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                {getIcon()}
                <p>{notification.message}</p>
              </div>
              <button 
                onClick={hideNotification}
                className="text-white hover:text-gray-200 ml-3"
                aria-label="Close notification"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};