import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { Prisma } from '@prisma/client'; // Import Prisma for Decimal type

/**
 * Creates an atomic funds transfer between two users.
 * @param {string} senderId - The ID of the user sending money.
 * @param {string} receiverEmail - The email of the user receiving money.
 * @param {number} amount - The amount to transfer.
 * @returns {Promise<object>} The created transaction record.
 */
export const createTransfer = async (senderId, receiverEmail, amount) => {
  const transferAmount = new Prisma.Decimal(amount);

  if (transferAmount.lessThanOrEqualTo(0)) {
    throw new ApiError(400, 'Transfer amount must be positive');
  }

  // 1. Find the receiver
  const receiver = await prisma.user.findUnique({
    where: { email: receiverEmail },
  });

  if (!receiver) {
    throw new ApiError(404, 'Receiver not found');
  }

  // 2. Check for self-transfer
  if (senderId === receiver.id) {
    throw new ApiError(400, 'You cannot send money to yourself');
  }

  // 3. Check sender's balance BEFORE starting the transaction
  const sender = await prisma.user.findUnique({
    where: { id: senderId },
  });

  if (!sender) {
    throw new ApiError(404, 'Sender not found');
  }

  if (sender.walletBalance.lessThan(transferAmount)) {
    throw new ApiError(400, 'Insufficient funds');
  }

  // 4. Execute the transfer as an atomic database transaction
  // This ensures that all operations succeed or all fail together.
  try {
    const [senderUpdate, receiverUpdate, transaction] = await prisma.$transaction([
      // 1. Debit the sender's account
      prisma.user.update({
        where: { id: senderId },
        data: {
          walletBalance: {
            decrement: transferAmount,
          },
        },
      }),

      // 2. Credit the receiver's account
      prisma.user.update({
        where: { id: receiver.id },
        data: {
          walletBalance: {
            increment: transferAmount,
          },
        },
      }),

      // 3. Create the transaction record
      prisma.transaction.create({
        data: {
          amount: transferAmount,
          type: 'TRANSFER',
          status: 'COMPLETED',
          senderId: senderId,
          receiverId: receiver.id,
        },
      }),
    ]);

    // Double-check post-transaction. (This check is redundant if DB constraints are set)
    if (senderUpdate.walletBalance.lessThan(0)) {
       // This should technically never be hit if the pre-check works,
       // but it's a good safeguard against race conditions if not using row-level locking.
       throw new Error('Insufficient funds after transaction.');
    }

    return transaction;

  } catch (error) {
    // If the transaction fails, Prisma automatically rolls back all changes.
    if (error.message.includes('Insufficient funds')) {
        throw new ApiError(400, 'Insufficient funds');
    }
    throw new ApiError(500, `Transaction failed: ${error.message}`);
  }
};

/**
 * Finds all transactions (sent or received) for a specific user.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Array<object>>} A list of transactions.
 */
export const findTransactionsForUser = async (userId) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    },
    include: {
      sender: {
        select: { name: true, email: true }, // Include sender's name and email
      },
      receiver: {
        select: { name: true, email: true }, // Include receiver's name and email
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return transactions;
};
