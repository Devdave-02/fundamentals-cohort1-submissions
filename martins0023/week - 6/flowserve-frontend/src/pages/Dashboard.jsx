import React from 'react';
import { useGetUsers } from '../hooks/useUsers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Fetch users to show a summary
  const { data, isLoading, isError, error } = useGetUsers(1, 5);

  const renderSummary = () => {
    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage message={error.message} />;
    
    return (
      <div className="dashboard-summary">
        <h2>System Status</h2>
        <p>
          Currently managing <strong>{data.meta.totalUsers}</strong> total users.
        </p>
        <h3>Recent Users:</h3>
        <ul className="user-list">
          {data.data.map((user) => (
            <li key={user.id} className="user-list-item">
              <div className="user-info">
                {user.name}
                <span>{user.email}</span>
              </div>
              <div className="user-balance">
                ${Number(user.walletBalance).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
        <Link to="/users" style={{ marginTop: '1rem', display: 'inline-block' }}>
          View All Users
        </Link>
      </div>
    );
  };

  return (
    <div>
      <h1>Welcome to FlowServe</h1>
      <p style={{ fontSize: '1.2rem', color: '#ccc' }}>
        Your reliable dashboard for managing users and transactions.
      </p>
      {renderSummary()}
    </div>
  );
};

export default Dashboard;
