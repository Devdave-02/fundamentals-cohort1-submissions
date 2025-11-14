const { z } = require('zod');

const idParamSchema = z.object({
  id: z.string().uuid()
});

const amountSchema = z.preprocess((v) => {
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number') return v.toString();
  return v;
}, z.string().regex(/^\d+(\.\d{1,2})?$/, 'Amount must be a positive number with up to 2 decimal places'));

const createTransactionSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['CREDIT', 'DEBIT']),
  amount: amountSchema,
  description: z.string().max(255).optional()
});

const updateTransactionSchema = z.object({
  description: z.string().max(255).optional()
});

const listTransactionsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  userId: z.string().uuid().optional()
});

module.exports = {
  idParamSchema,
  createTransactionSchema,
  updateTransactionSchema,
  listTransactionsQuerySchema
};
