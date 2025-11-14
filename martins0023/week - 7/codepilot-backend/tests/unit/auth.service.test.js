const authService = require('../../src/modules/auth/auth.service');
const bcrypt = require('bcryptjs'); // Import the module
const jwt = require('jsonwebtoken'); // Import the module

// REMOVED: The broken jest.spyOn('bcryptjs', ...)

describe('Auth Service (Unit Tests)', () => {
  
  // Clean the mock DB before each test
  beforeEach(() => {
    authService.__cleanupMockDb();
    // Reset mocks before each test
    jest.restoreAllMocks(); 
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      // Correctly spy on the imported module's method
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('mockedSalt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('mockedHashedPassword');

      const user = await authService.registerUser('testuser', 'password123');

      expect(user).toBeDefined();
      expect(user.username).toBe('testuser');
      expect(user.id).toBe(1);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'mockedSalt');
      
      // Check if user is in mock DB
      expect(authService.MOCK_DB.users[0]).toBeDefined();
      expect(authService.MOCK_DB.users[0].password).toBe('mockedHashedPassword');
    });

    it('should throw error if username is taken', async () => {
      await authService.registerUser('testuser', 'password123');
      
      await expect(authService.registerUser('testuser', 'otherpass'))
        .rejects
        .toThrow('Username already taken');
    });

    it('should throw error if username or password is missing', async () => {
      await expect(authService.registerUser('testuser', null))
        .rejects
        .toThrow('Username and password are required');
      await expect(authService.registerUser(null, 'password123'))
        .rejects
        .toThrow('Username and password are required');
    });
  });

  describe('loginUser', () => {
    
    beforeEach(async () => {
      // Register a user to test login
      // Since we're not mocking hash globally, this will use the real hash
      await authService.registerUser('testuser', 'password123');
    });

    it('should login successfully with correct credentials', async () => {
      // Mock that passwords match
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); 
      // Mock the token signing
      jest.spyOn(jwt, 'sign').mockReturnValue('mockedJwtToken');

      const { token } = await authService.loginUser('testuser', 'password123');

      expect(token).toBe('mockedJwtToken');
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('should throw error for non-existent user', async () => {
      await expect(authService.loginUser('wronguser', 'password123'))
        .rejects
        .toThrow('Invalid credentials');
    });

    it('should throw error for incorrect password', async () => {
      // Mock that passwords do NOT match
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); 

      await expect(authService.loginUser('testuser', 'wrongpassword'))
        .rejects
        .toThrow('Invalid credentials');
    });
  });
});