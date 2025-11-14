const prisma = require('../config/prisma');
const { parsePagination } = require('../utils/pagination');
const ApiError = require('../utils/ApiError');

async function createUser(data) {
  const user = await prisma.user.create({ data });
  return user;
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

async function listUsers(query) {
  const { skip, take, page, limit } = parsePagination(query);
  const where = query.search
    ? {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } }
        ]
      }
    : {};

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } })
  ]);
  return {
    data: users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
}

async function updateUser(id, data) {
  await getUserById(id);
  const user = await prisma.user.update({ where: { id }, data });
  return user;
}

async function deleteUser(id) {
  await getUserById(id);
  await prisma.user.delete({ where: { id } });
  return { id };
}

module.exports = {
  createUser,
  getUserById,
  listUsers,
  updateUser,
  deleteUser
};
