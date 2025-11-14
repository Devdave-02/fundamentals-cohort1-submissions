import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">DevConnect</Link>
        <div className="flex items-center space-x-4">
          <Link to="/projects" className="text-gray-600 hover:text-blue-500">Projects</Link>
          {user ? (
            <>
              <Link to="/create-project" className="text-gray-600 hover:text-blue-500">New Project</Link>
              <Link to="/profile" className="text-gray-600 hover:text-blue-500">{user.username}</Link>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
              <Link to="/signup" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;