const request = require('supertest');
const app = require('../../src/app');
const {
  assertSuccessResponse,
  assertErrorResponse,
  createTestUser
} = require('../helpers/testUtils');

describe('Transaction API - Integration Tests', () => {
  let testUser;

  beforeAll(async () => {
    // Create a test user for transaction tests
    testUser = await createTestUser({
      name: 'Transaction Test User',
      email: `transtest${Date.now()}@example.com`,
      balance: 1000
    });
  });

  describe('POST /api/transactions', () => {
    it('should create a deposit transaction successfully', async () => {
      const transactionData = {
        userId: testUser.id,
        type: 'deposit',
        amount: 500,
        description: 'Test deposit'
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(transactionData)
        .expect(201);

      assertSuccessResponse(response, 201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.type).toBe('deposit');
      expect(response.body.data.amount).toBe(500);
      expect(response.body.data.userId).toBe(testUser.id);
    });

    it('should create a withdrawal transaction successfully', async () => {
      const transactionData = {
        userId: testUser.id,
        type: 'withdrawal',
        amount: 200,
        description: 'Test withdrawal'
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(transactionData)
        .expect(201);

      assertSuccessResponse(response, 201);
      expect(response.body.data.type).toBe('withdrawal');
      expect(response.body.data.amount).toBe(200);
    });

    it('should reject transaction with insufficient balance', async () => {
      const transactionData = {
        userId: testUser.id,
        type: 'withdrawal',
        amount: 999999,
        description: 'Large withdrawal'
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(transactionData)
        .expect(400);

      assertErrorResponse(response, 400, 'insufficient');
    });

    it('should reject transaction with invalid amount', async () => {
      const transactionData = {
        userId: testUser.id,
        type: 'deposit',
        amount: -100,
        description: 'Negative amount'
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(transactionData)
        .expect(400);

      assertErrorResponse(response, 400);
    });

    it('should reject transaction with invalid type', async () => {
      const transactionData = {
        userId: testUser.id,
        type: 'invalid_type',
        amount: 100,
        description: 'Invalid type'
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(transactionData)
        .expect(400);

      assertErrorResponse(response, 400);
    });

    it('should reject transaction for non-existent user', async () => {
      const transactionData = {
        userId: 99999,
        type: 'deposit',
        amount: 100,
        description: 'Non-existent user'
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(transactionData)
        .expect(404);

      assertErrorResponse(response, 404, 'not found');
    });
  });

  describe('GET /api/transactions', () => {
    beforeAll(async () => {
      // Create some test transactions
      await request(app)
        .post('/api/transactions')
        .send({
          userId: testUser.id,
          type: 'deposit',
          amount: 100,
          description: 'Test transaction 1'
        });

      await request(app)
        .post('/api/transactions')
        .send({
          userId: testUser.id,
          type: 'withdrawal',
          amount: 50,
          description: 'Test transaction 2'
        });
    });

    it('should list all transactions with pagination', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .query({ page: 1, limit: 10 })
        .expect(200);

      assertSuccessResponse(response);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('pagination');
    });

    it('should filter transactions by user', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .query({ userId: testUser.id })
        .expect(200);

      assertSuccessResponse(response);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Verify all transactions belong to the user
      response.body.data.forEach(transaction => {
        expect(transaction.userId).toBe(testUser.id);
      });
    });

    it('should filter transactions by type', async () => {
      const response = await request(app)
        .get('/api/transactions')
        .query({ type: 'deposit' })
        .expect(200);

      assertSuccessResponse(response);
      
      // Verify all transactions are deposits
      response.body.data.forEach(transaction => {
        expect(transaction.type).toBe('deposit');
      });
    });
  });

  describe('GET /api/transactions/:id', () => {
    it('should get transaction by id', async () => {
      // Create a transaction first
      const createResponse = await request(app)
        .post('/api/transactions')
        .send({
          userId: testUser.id,
          type: 'deposit',
          amount: 250,
          description: 'Get test transaction'
        });

      const transactionId = createResponse.body.data.id;

      // Get the transaction
      const response = await request(app)
        .get(`/api/transactions/${transactionId}`)
        .expect(200);

      assertSuccessResponse(response);
      expect(response.body.data.id).toBe(transactionId);
      expect(response.body.data.amount).toBe(250);
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await request(app)
        .get('/api/transactions/99999')
        .expect(404);

      assertErrorResponse(response, 404, 'not found');
    });
  });

  describe('GET /api/transactions/user/:userId', () => {
    it('should get all transactions for a specific user', async () => {
      const response = await request(app)
        .get(`/api/transactions/user/${testUser.id}`)
        .expect(200);

      assertSuccessResponse(response);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Verify all transactions belong to the user
      response.body.data.forEach(transaction => {
        expect(transaction.userId).toBe(testUser.id);
      });
    });

    it('should return empty array for user with no transactions', async () => {
      // Create a new user with no transactions
      const newUser = await createTestUser({
        name: 'No Transactions User',
        email: `notrans${Date.now()}@example.com`,
        balance: 500
      });

      const response = await request(app)
        .get(`/api/transactions/user/${newUser.id}`)
        .expect(200);

      assertSuccessResponse(response);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('Transaction Balance Updates', () => {
    it('should update user balance after deposit', async () => {
      // Get initial balance
      const userBefore = await request(app)
        .get(`/api/users/${testUser.id}`);
      
      const initialBalance = userBefore.body.data.balance;

      // Make deposit
      await request(app)
        .post('/api/transactions')
        .send({
          userId: testUser.id,
          type: 'deposit',
          amount: 300,
          description: 'Balance test deposit'
        })
        .expect(201);

      // Get updated balance
      const userAfter = await request(app)
        .get(`/api/users/${testUser.id}`);
      
      const finalBalance = userAfter.body.data.balance;

      expect(finalBalance).toBe(initialBalance + 300);
    });

    it('should update user balance after withdrawal', async () => {
      // Get initial balance
      const userBefore = await request(app)
        .get(`/api/users/${testUser.id}`);
      
      const initialBalance = userBefore.body.data.balance;

      // Make withdrawal
      await request(app)
        .post('/api/transactions')
        .send({
          userId: testUser.id,
          type: 'withdrawal',
          amount: 150,
          description: 'Balance test withdrawal'
        })
        .expect(201);

      // Get updated balance
      const userAfter = await request(app)
        .get(`/api/users/${testUser.id}`);
      
      const finalBalance = userAfter.body.data.balance;

      expect(finalBalance).toBe(initialBalance - 150);
    });
  });
});
