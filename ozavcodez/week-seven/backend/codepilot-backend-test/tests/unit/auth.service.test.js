const authService = require('../../src/modules/auth/auth.service');
const { ValidationError, UnauthorizedError, ConflictError } = require('../../src/utils/errors');

describe('Auth Service - Unit Tests', () => {
  beforeEach(() => {
    authService.clearUsers();
  });

  describe('hashPassword', () => {
    it('should hash a valid password', async () => {
      const password = 'password123';
      const hash = await authService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should throw ValidationError for password less than 6 characters', async () => {
      await expect(authService.hashPassword('12345')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for empty password', async () => {
      await expect(authService.hashPassword('')).rejects.toThrow(ValidationError);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'password123';
      const hash = await authService.hashPassword(password);
      const isMatch = await authService.comparePassword(password, hash);

      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'password123';
      const hash = await authService.hashPassword(password);
      const isMatch = await authService.comparePassword('wrongpassword', hash);

      expect(isMatch).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = authService.generateToken('user123', 'test@example.com');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const userId = 'user123';
      const email = 'test@example.com';
      const token = authService.generateToken(userId, email);

      const decoded = authService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
    });

    it('should throw UnauthorizedError for invalid token', () => {
      expect(() => authService.verifyToken('invalid.token.here')).toThrow(UnauthorizedError);
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const result = await authService.register('test@example.com', 'password123', 'Test User');

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(result.user.password).toBeUndefined(); // Password should not be returned
      expect(result.user.id).toBeDefined();
    });

    it('should throw ValidationError when email is missing', async () => {
      await expect(authService.register('', 'password123', 'Test User')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError when password is missing', async () => {
      await expect(authService.register('test@example.com', '', 'Test User')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError when name is missing', async () => {
      await expect(authService.register('test@example.com', 'password123', '')).rejects.toThrow(ValidationError);
    });

    it('should throw ConflictError when user already exists', async () => {
      await authService.register('test@example.com', 'password123', 'Test User');
      await expect(authService.register('test@example.com', 'password456', 'Another User')).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      await authService.register('test@example.com', 'password123', 'Test User');
    });

    it('should login successfully with valid credentials', async () => {
      const result = await authService.login('test@example.com', 'password123');

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.password).toBeUndefined();
    });

    it('should throw UnauthorizedError with invalid email', async () => {
      await expect(authService.login('wrong@example.com', 'password123')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError with invalid password', async () => {
      await expect(authService.login('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedError);
    });

    it('should throw ValidationError when email is missing', async () => {
      await expect(authService.login('', 'password123')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError when password is missing', async () => {
      await expect(authService.login('test@example.com', '')).rejects.toThrow(ValidationError);
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const { user } = await authService.register('test@example.com', 'password123', 'Test User');
      const foundUser = authService.getUserById(user.id);

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(user.id);
      expect(foundUser.email).toBe('test@example.com');
      expect(foundUser.password).toBeUndefined();
    });

    it('should throw UnauthorizedError for non-existent user', () => {
      expect(() => authService.getUserById('nonexistent')).toThrow(UnauthorizedError);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users without passwords', async () => {
      await authService.register('user1@example.com', 'password123', 'User 1');
      await authService.register('user2@example.com', 'password123', 'User 2');

      const users = authService.getAllUsers();

      expect(users).toHaveLength(2);
      expect(users[0].password).toBeUndefined();
      expect(users[1].password).toBeUndefined();
    });

    it('should return empty array when no users exist', () => {
      const users = authService.getAllUsers();
      expect(users).toHaveLength(0);
    });
  });
});
