import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <strong>Error:</strong> {message || 'An unknown error occurred.'}
    </div>
  );
};

export default ErrorMessage;
