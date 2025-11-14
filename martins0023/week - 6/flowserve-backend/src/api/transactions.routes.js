import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller.js';
import { validate } from '../middleware/validate.js';
import {
  createTransferSchema,
  getTransactionsSchema,
} from '../schemas/transaction.schema.js';

const router = Router();

// --- Transaction Routes ---

// POST /api/v1/transactions/transfer
// Create a new funds transfer
router.post(
  '/transfer',
  validate(createTransferSchema),
  transactionController.createTransfer
);

// GET /api/v1/transactions/:userId
// Get all transactions for a specific user (sent or received)
router.get(
  '/:userId',
  validate(getTransactionsSchema),
  transactionController.getTransactionsForUser
);

export default router;
