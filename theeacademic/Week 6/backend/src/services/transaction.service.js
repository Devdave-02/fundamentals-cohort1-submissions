const prisma = require('../config/prisma');
const { parsePagination } = require('../utils/pagination');
const ApiError = require('../utils/ApiError');

async function getTransactionById(id) {
  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx) throw new ApiError(404, 'Transaction not found');
  return tx;
}

async function listTransactions(query) {
  const { skip, take, page, limit } = parsePagination(query);
  const where = query.userId ? { userId: query.userId } : {};

  const [total, transactions] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } })
  ]);
  return {
    data: transactions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
}

async function createTransaction({ userId, type, amount, description }) {
  // amount as string -> Decimal handled by Prisma
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, 'User not found');

    if (type === 'DEBIT') {
      // Ensure sufficient funds
      const hasFunds = await tx.user.findFirst({
        where: { id: userId, balance: { gte: amount } }
      });
      if (!hasFunds) throw new ApiError(400, 'Insufficient funds');
    }

    // Update balance atomically
    await tx.user.update({
      where: { id: userId },
      data: {
        balance: type === 'CREDIT' ? { increment: amount } : { decrement: amount }
      }
    });

    const created = await tx.transaction.create({
      data: { userId, type, amount, description }
    });
    return created;
  });
}

async function updateTransaction(id, data) {
  // Only description is updatable in our design
  await getTransactionById(id);
  const updated = await prisma.transaction.update({ where: { id }, data });
  return updated;
}

async function deleteTransaction(id) {
  const existing = await getTransactionById(id);
  // Reverse its effect on balance
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: existing.userId },
      data: {
        balance: existing.type === 'CREDIT'
          ? { decrement: existing.amount }
          : { increment: existing.amount }
      }
    });
    await tx.transaction.delete({ where: { id } });
  });
  return { id };
}

module.exports = {
  getTransactionById,
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
