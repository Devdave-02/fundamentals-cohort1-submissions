import React from 'react';

export default function Alert({ type = 'info', message }) {
  return <div className={`alert ${type}`}>{message}</div>;
}
