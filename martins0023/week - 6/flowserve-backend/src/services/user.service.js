import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';

/**
 * Creates a new user in the database.
 * @param {object} userData - User data from the request body.
 * @returns {Promise<object>} The created user object (without password).
 */
export const createNewUser = async (userData) => {
  const { email, name, password } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
    // Select only the fields to return (exclude password)
    select: {
      id: true,
      email: true,
      name: true,
      walletBalance: true,
      createdAt: true,
    },
  });

  return user;
};

/**
 * Finds all users with pagination.
 * @param {number} page - The current page number.
 * @param {number} limit - The number of users per page.
 * @returns {Promise<object>} Object containing user data and pagination metadata.
 */
export const findUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const take = limit;

  // 1. Get the users for the current page
  const users = await prisma.user.findMany({
    skip,
    take,
    select: {
      id: true,
      email: true,
      name: true,
      walletBalance: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 2. Get the total count of all users
  const totalUsers = await prisma.user.count();

  return {
    data: users,
    meta: {
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    },
  };
};

/**
 * Finds a single user by their ID.
 * @param {string} id - The user's ID.
 * @returns {Promise<object>} The user object (without password).
 */
export const findUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      walletBalance: true,
      createdAt: true,
      sentTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 5, // Include last 5 sent transactions
      },
      receivedTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 5, // Include last 5 received transactions
      },
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};
