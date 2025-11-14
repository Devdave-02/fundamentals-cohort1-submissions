import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center p-10 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-4">Welcome to DevConnect</h1>
      <p className="text-lg text-gray-700 mb-6">
        The platform where developers connect, share ideas, and collaborate on projects.
      </p>
      <Link 
        to="/projects" 
        className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300">
        Explore Projects
      </Link>
    </div>
  );
};

export default Home;