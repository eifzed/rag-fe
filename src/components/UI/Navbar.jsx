// src/components/UI/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoSvg from '../../assets/logo.svg';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logoSvg} alt="Logo" className="h-8 w-auto" />
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/contexts"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/contexts') 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Contexts
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;