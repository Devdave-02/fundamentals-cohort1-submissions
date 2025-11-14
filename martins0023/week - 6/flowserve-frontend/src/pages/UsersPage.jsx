import React, { useState } from 'react';
import { useGetUsers } from '../hooks/useUsers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, isFetching } = useGetUsers(page, limit);

  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage message={error.message} />;
    
    if (data) {
      return (
        <>
          <ul className="user-list">
            {data.data.map((user) => (
              <li key={user.id} className="user-list-item">
                <div className="user-info">
                  {user.name}
                  <span>ID: {user.id} | Email: {user.email}</span>
                </div>
                <div className="user-balance">
                  ${Number(user.walletBalance).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {data.meta.page} of {data.meta.totalPages}
            </span>
            <button
              onClick={() => setPage((old) => (data.meta.page < data.meta.totalPages ? old + 1 : old))}
              disabled={data.meta.page === data.meta.totalPages}
            >
              Next
            </button>
          </div>
          {isFetching && <p>Updating...</p>}
        </>
      );
    }
    
    return null;
  };

  return (
    <div>
      <h1>User Management</h1>
      <p>A list of all users in the FlowServe system.</p>
      {renderContent()}
    </div>
  );
};

export default UsersPage;
