import React, { useState } from 'react';
import api from '../api/client';
import Loader from './common/Loader.jsx';
import Alert from './common/Alert.jsx';

export default function TransactionForm() {
  const [userId, setUserId] = useState('');
  const [type, setType] = useState('CREDIT');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    try {
      await api.post('/transactions', { userId, type, amount, description });
      setSuccess('Transaction successful!');
      setAmount(''); setDescription('');
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="form">
      {loading && <Loader />} 
      {error && <Alert type="error" message={error} />} 
      {success && <Alert type="success" message={success} />} 

      <label>
        User ID
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="UUID" required />
      </label>
      <label>
        Type
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="CREDIT">CREDIT</option>
          <option value="DEBIT">DEBIT</option>
        </select>
      </label>
      <label>
        Amount
        <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
      </label>
      <label>
        Description
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
      </label>
      <button type="submit" disabled={loading}>Submit</button>
    </form>
  );
}
