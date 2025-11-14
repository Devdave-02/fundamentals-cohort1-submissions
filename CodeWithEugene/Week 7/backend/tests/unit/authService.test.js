const authService = require('../../src/services/authService');

describe('Auth Service - Unit Tests', () => {
  beforeEach(() => {
    // Clear users array before each test
    // Note: In a real app, you'd reset the database
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123';
      const hashed = await authService.hashPassword(password);
      
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'testpassword123';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);
      
      expect(hash1).not.toBe(hash2); // Different salts
    });
  });

  describe('comparePassword', () => {
    it('should correctly verify a password against its hash', async () => {
      const password = 'testpassword123';
      const hashed = await authService.hashPassword(password);
      const isValid = await authService.comparePassword(password, hashed);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testpassword123';
      const wrongPassword = 'wrongpassword';
      const hashed = await authService.hashPassword(password);
      const isValid = await authService.comparePassword(wrongPassword, hashed);
      
      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const user = { id: 1, email: 'test@example.com', role: 'user' };
      const token = authService.generateToken(user);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    it('should include user data in token', () => {
      const user = { id: 1, email: 'test@example.com', role: 'user' };
      const token = authService.generateToken(user);
      
      // Decode the token (without verification)
      const parts = token.split('.');
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      expect(payload.id).toBe(user.id);
      expect(payload.email).toBe(user.email);
      expect(payload.role).toBe(user.role);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const result = await authService.register('test@example.com', 'password123', 'Test User');
      
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(result.user.id).toBeDefined();
    });

    it('should throw error if user already exists', async () => {
      await authService.register('test@example.com', 'password123', 'Test User');
      
      await expect(
        authService.register('test@example.com', 'password123', 'Test User')
      ).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login with correct credentials', async () => {
      await authService.register('test@example.com', 'password123', 'Test User');
      
      const result = await authService.login('test@example.com', 'password123');
      
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error with incorrect email', async () => {
      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error with incorrect password', async () => {
      await authService.register('test@example.com', 'password123', 'Test User');
      
      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const result = await authService.register('test@example.com', 'password123', 'Test User');
      const userId = result.user.id;
      
      const user = authService.getUserById(userId);
      
      expect(user).toBeDefined();
      expect(user.id).toBe(userId);
      expect(user.email).toBe('test@example.com');
    });

    it('should return undefined for non-existent user', () => {
      const user = authService.getUserById(999);
      expect(user).toBeUndefined();
    });
  });
});
