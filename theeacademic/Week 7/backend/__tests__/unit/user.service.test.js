const userService = require('../../src/services/user.service');
const { createMockPrismaClient } = require('../helpers/testUtils');

// Mock Prisma client
jest.mock('../../src/config/database', () => ({
  prisma: createMockPrismaClient()
}));

const { prisma } = require('../../src/config/database');

describe('User Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        balance: 1000
      };

      const mockUser = {
        id: 1,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email }
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: userData
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'existing@example.com',
        balance: 1000
      };

      prisma.user.findUnique.mockResolvedValue({ id: 1, ...userData });

      await expect(userService.createUser(userData)).rejects.toThrow(
        'Email already exists'
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should throw error if balance is negative', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        balance: -100
      };

      await expect(userService.createUser(userData)).rejects.toThrow();
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(userService.getUserById(999)).rejects.toThrow(
        'User not found'
      );
    });

    it('should handle invalid id format', async () => {
      await expect(userService.getUserById('invalid')).rejects.toThrow();
    });
  });

  describe('listUsers', () => {
    it('should return paginated list of users', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com', balance: 1000 },
        { id: 2, name: 'User 2', email: 'user2@example.com', balance: 2000 }
      ];

      prisma.user.findMany.mockResolvedValue(mockUsers);
      prisma.user.count.mockResolvedValue(2);

      const result = await userService.listUsers({ page: 1, limit: 10 });

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(prisma.user.count).toHaveBeenCalled();
      expect(result.data).toEqual(mockUsers);
      expect(result.pagination).toHaveProperty('total', 2);
      expect(result.pagination).toHaveProperty('page', 1);
    });

    it('should handle empty result', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      const result = await userService.listUsers({});

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });

    it('should apply filters correctly', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      prisma.user.count.mockResolvedValue(0);

      await userService.listUsers({ search: 'john' });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array)
          })
        })
      );
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const existingUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        balance: 1000
      };

      const updateData = {
        name: 'John Updated',
        balance: 1500
      };

      const updatedUser = { ...existingUser, ...updateData };

      prisma.user.findUnique.mockResolvedValue(existingUser);
      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await userService.updateUser(1, updateData);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw error if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        userService.updateUser(999, { name: 'New Name' })
      ).rejects.toThrow('User not found');
    });

    it('should prevent updating to negative balance', async () => {
      const existingUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        balance: 1000
      };

      prisma.user.findUnique.mockResolvedValue(existingUser);

      await expect(
        userService.updateUser(1, { balance: -500 })
      ).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        balance: 1000
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.delete.mockResolvedValue(mockUser);

      const result = await userService.deleteUser(1);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toHaveProperty('message', 'User deleted successfully');
    });

    it('should throw error if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(userService.deleteUser(999)).rejects.toThrow(
        'User not found'
      );
    });
  });
});
