import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoSvg from '../../assets/logo_new.svg';
import { getUserAuth, removeAuth } from '../../utils/auth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  const checkAuthStatus = () => {
    const user = getUserAuth();
    
    if (user.token && user.user) {
      try {
        setUser(JSON.parse(user.user));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };
  
  const handleStorageChange = (e) => {
    if (e.key === 'user' || e.key === 'token') {
      checkAuthStatus();
    }
  };
  
  // Check authentication status on mount and when location changes
  useEffect(() => {
    checkAuthStatus();
    
    // Setup event listener for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Create a custom event listener for auth changes
    window.addEventListener('authChange', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, [location]);
  
  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    removeAuth()

    setUser(null);
    setIsDropdownOpen(false);
    
    // Dispatch an event to notify other components about auth change
    window.dispatchEvent(new Event('authChange'));
    
    navigate('/login');
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Function to truncate email if too long
  const truncateEmail = (email) => {
    if (!email) return '';
    if (email.length > 24) {
      return email.substring(0, 21) + '...';
    }
    return email;
  };
  
  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 pl-2 md:pl-6">
            <Link to="/" className="flex items-center">
              <img src={logoSvg} alt="Logo" className="h-8 w-auto" />
            </Link>
          </div>
          
          {/* Spacer to push content apart */}
          <div className="flex-grow"></div>
          
          <div className="flex items-center space-x-6 pr-2 md:pr-6">
            <Link
              to="/contexts"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/contexts') 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              My Contexts
            </Link>
            <Link
              to="/chat"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/chat') 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Chat
            </Link>
            
            {/* User Avatar Button */}
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                {user && user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-gray-700 border-b truncate">
                        {truncateEmail(user.email)}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;