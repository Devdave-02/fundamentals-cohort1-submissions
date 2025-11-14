import apiClient from './apiClient';

/**
 * Creates a new funds transfer.
 * @param {object} transferData - The transfer details.
 * @param {string} transferData.senderId - The ID of the sender.
 * @param {string} transferData.receiverEmail - The email of the receiver.
 * @param {number} transferData.amount - The amount to transfer.
 * @returns {Promise<object>} The created transaction object.
 */
export const createTransfer = async ({ senderId, receiverEmail, amount }) => {
  const response = await apiClient.post('/transactions/transfer', {
    senderId,
    receiverEmail,
    amount,
  });
  // Our backend ApiResponse returns { data }
  return response.data;
};

/**
 * Fetches all transactions for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<object>>} A list of transactions.
 */
export const getTransactionsForUser = async (userId) => {
  const response = await apiClient.get(`/transactions/${userId}`);
  // Our backend ApiResponse returns { data }
  return response.data;
};
