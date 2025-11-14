import { Router } from 'express';
import userRoutes from './users.routes.js';
import transactionRoutes from './transactions.routes.js';

const router = Router();

// --- Health Check for API v1 ---
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'API v1 is healthy' });
});

// --- Mount Routes ---
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);

export default router;
