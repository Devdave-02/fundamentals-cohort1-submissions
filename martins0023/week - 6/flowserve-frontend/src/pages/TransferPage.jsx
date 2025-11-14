import React, { useState } from 'react';
import { useCreateTransfer } from '../hooks/useTransactions';
import { useGetUsers } from '../hooks/useUsers';
import LoadingSpinner from '../components/LoadingSpinner';

const TransferPage = () => {
  const [senderId, setSenderId] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');

  // Use the mutation hook
  const { mutate: createTransfer, isPending } = useCreateTransfer();

  // Fetch all users to populate the "Sender" dropdown
  // We fetch a high limit to get all users for this demo
  const { data: usersData, isLoading: usersLoading } = useGetUsers(1, 100);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!senderId || !receiverEmail || !amount) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Call the mutation function
    createTransfer(
      { senderId, receiverEmail, amount: parseFloat(amount) },
      {
        onSuccess: () => {
          // Reset form on success
          setSenderId('');
          setReceiverEmail('');
          setAmount('');
        },
      }
    );
  };

  return (
    <div>
      <h1>Simulate a Transaction</h1>
      <p>Transfer funds between two users.</p>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sender">From (Sender)</label>
            {usersLoading ? (
              <LoadingSpinner />
            ) : (
              <select
                id="sender"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                required
              >
                <option value="" disabled>Select a sender</option>
                {usersData?.data.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} (${Number(user.walletBalance).toFixed(2)})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="receiver">To (Receiver's Email)</label>
            <input
              type="email"
              id="receiver"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              placeholder="e.g., alice@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 50.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          <button type="submit" disabled={isPending || usersLoading}>
            {isPending ? 'Sending...' : 'Send Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferPage;
