const authService = require('./authService');

const getAllUsers = () => {
  // In production, this would fetch from database
  // For now, return empty array as we don't expose password hashes
  return [];
};

const getUserProfile = (userId) => {
  const user = authService.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt
  };
};

const updateUserProfile = (userId, updates) => {
  const user = authService.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (updates.name) {
    user.name = updates.name;
  }

  if (updates.email) {
    const existingUser = authService.getUserByEmail(updates.email);
    if (existingUser && existingUser.id !== parseInt(userId)) {
      throw new Error('Email already in use');
    }
    user.email = updates.email;
  }

  user.updatedAt = new Date().toISOString();

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    updatedAt: user.updatedAt
  };
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile
};
