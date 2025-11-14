const asyncHandler = require('../utils/asyncHandler');
const txService = require('../services/transaction.service');

const createTransaction = asyncHandler(async (req, res) => {
  const tx = await txService.createTransaction(req.body);
  res.status(201).json({ success: true, data: tx });
});

const getTransaction = asyncHandler(async (req, res) => {
  const tx = await txService.getTransactionById(req.params.id);
  res.json({ success: true, data: tx });
});

const listTransactions = asyncHandler(async (req, res) => {
  const result = await txService.listTransactions(req.query);
  res.json({ success: true, ...result });
});

const updateTransaction = asyncHandler(async (req, res) => {
  const tx = await txService.updateTransaction(req.params.id, req.body);
  res.json({ success: true, data: tx });
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const result = await txService.deleteTransaction(req.params.id);
  res.json({ success: true, data: result });
});

module.exports = {
  createTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
  deleteTransaction
};
