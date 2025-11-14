import React from 'react';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center mt-10">Please log in to view your profile.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6">{user.username}'s Profile</h2>
      <div className="space-y-4">
        <div>
          <p className="font-bold text-gray-700">Username:</p>
          <p className="text-gray-600">{user.username}</p>
        </div>
        <div>
          <p className="font-bold text-gray-700">Email:</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
        <div>
          <p className="font-bold text-gray-700">Member Since:</p>
          <p className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;