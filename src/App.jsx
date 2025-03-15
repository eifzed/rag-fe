import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/UI/Navbar';

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default App;