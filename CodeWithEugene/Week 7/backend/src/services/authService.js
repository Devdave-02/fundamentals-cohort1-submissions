const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory user store (replace with database in production)
const users = [];

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const register = async (email, password, name) => {
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    name,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  const token = generateToken(newUser);
  
  return {
    user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
    token
  };
};

const login = async (email, password) => {
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);
  
  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token
  };
};

const getUserById = (id) => {
  return users.find(u => u.id === parseInt(id));
};

const getUserByEmail = (email) => {
  return users.find(u => u.email === email);
};

module.exports = {
  register,
  login,
  getUserById,
  getUserByEmail,
  hashPassword,
  comparePassword,
  generateToken
};
