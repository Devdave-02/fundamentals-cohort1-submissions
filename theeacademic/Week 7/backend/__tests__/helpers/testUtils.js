const request = require('supertest');
const app = require('../src/app');

/**
 * Test helper utilities for API testing
 */

/**
 * Create a test user
 */
async function createTestUser(userData = {}) {
  const defaultUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    balance: 1000
  };

  const response = await request(app)
    .post('/api/users')
    .send({ ...defaultUser, ...userData });

  return response.body.data;
}

/**
 * Create a test transaction
 */
async function createTestTransaction(transactionData = {}) {
  const defaultTransaction = {
    userId: transactionData.userId || 1,
    type: 'deposit',
    amount: 100,
    description: 'Test transaction'
  };

  const response = await request(app)
    .post('/api/transactions')
    .send({ ...defaultTransaction, ...transactionData });

  return response.body.data;
}

/**
 * Clean up test data (if needed)
 */
async function cleanupTestData() {
  // This would typically use Prisma to clean up test database
  // For now, we rely on test database being reset between test runs
}

/**
 * Mock Prisma client for unit tests
 */
function createMockPrismaClient() {
  return {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    transaction: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    $transaction: jest.fn()
  };
}

/**
 * Assert error response format
 */
function assertErrorResponse(response, statusCode, message) {
  expect(response.status).toBe(statusCode);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('error');
  if (message) {
    expect(response.body.error).toContain(message);
  }
}

/**
 * Assert success response format
 */
function assertSuccessResponse(response, statusCode = 200) {
  expect(response.status).toBe(statusCode);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('data');
}

module.exports = {
  createTestUser,
  createTestTransaction,
  cleanupTestData,
  createMockPrismaClient,
  assertErrorResponse,
  assertSuccessResponse
};
