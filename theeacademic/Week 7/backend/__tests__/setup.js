/**
 * Jest Setup File
 * 
 * This file runs before all tests to configure the test environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/codepilot_test';

// Increase test timeout for integration tests
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
  // Setup can include:
  // - Database connection
  // - Seed test data
  // - Initialize services
  console.log('🧪 Test environment initialized');
});

// Global test teardown
afterAll(async () => {
  // Cleanup can include:
  // - Close database connections
  // - Clear test data
  // - Stop services
  console.log('✅ Test environment cleaned up');
});

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Uncomment to suppress console.log in tests
  // log: jest.fn(),
  // Uncomment to suppress console.error in tests
  // error: jest.fn(),
  // Uncomment to suppress console.warn in tests
  // warn: jest.fn(),
};
