import { z } from 'zod';

// Schema for creating a new transfer
export const createTransferSchema = z.object({
  body: z.object({
    senderId: z.string().cuid('Invalid sender ID'),
    receiverEmail: z.string().email('Invalid receiver email'),
    
    // --- THIS IS THE FIX ---
    // z.coerce.number() safely converts the incoming value (string or number)
    // to a number, and then checks if it's positive.
    amount: z.coerce
      .number({ invalid_type_error: 'Amount must be a number' })
      .positive({ message: 'Amount must be greater than 0' }),
  }),
});

// Schema for getting transactions for a user
export const getTransactionsSchema = z.object({
  params: z.object({
    userId: z.string().cuid('Invalid user ID format'),
  }),
});