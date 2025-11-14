import React, { useState, useEffect } from 'react';
import { getUsers } from '../api/apiService';

const UserSelector = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await getUsers();
        setUsers(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <label htmlFor="user-select">Select a User: </label>
      <select id="user-select" onChange={(e) => onUserSelect(e.target.value)}>
        <option value="">-- Please choose a user --</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username} ({user.email})
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelector;