import * as transactionService from '../services/transaction.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * @desc    Create a new funds transfer
 * @route   POST /api/v1/transactions/transfer
 * @access  Public (should be Private/Authenticated in a real app)
 */
export const createTransfer = asyncHandler(async (req, res) => {
  const { senderId, receiverEmail, amount } = req.body;
  
  const transaction = await transactionService.createTransfer(
    senderId,
    receiverEmail,
    amount
  );
  
  res.status(201).json(new ApiResponse(201, transaction, 'Transfer successful'));
});

/**
 * @desc    Get all transactions for a user
 * @route   GET /api/v1/transactions/:userId
 * @access  Public (should be Private/Authenticated)
 */
export const getTransactionsForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const transactions = await transactionService.findTransactionsForUser(userId);
  
  res.status(200).json(new ApiResponse(200, transactions, 'Transactions fetched successfully'));
});
