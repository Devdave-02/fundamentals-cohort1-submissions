const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../../config/config');
const { ValidationError, UnauthorizedError, ConflictError } = require('../../utils/errors');

// In-memory user store (in production, use a database)
const users = new Map();

class AuthService {
  /**
   * Hash password
   */
  async hashPassword(password) {
    if (!password || password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long');
    }
    return await bcrypt.hash(password, 10);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  generateToken(userId, email) {
    return jwt.sign(
      { userId, email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  /**
   * Register a new user
   */
  async register(email, password, name) {
    // Validate input
    if (!email || !password || !name) {
      throw new ValidationError('Email, password, and name are required');
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString()
    };

    users.set(user.id, user);

    // Generate token
    const token = this.generateToken(user.id, user.email);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Validate input
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user
    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Compare password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user.id, user.email);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Get user by ID
   */
  getUserById(userId) {
    const user = users.get(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get all users (for testing purposes)
   */
  getAllUsers() {
    return Array.from(users.values()).map(({ password, ...user }) => user);
  }

  /**
   * Clear all users (for testing purposes)
   */
  clearUsers() {
    users.clear();
  }
}

module.exports = new AuthService();
