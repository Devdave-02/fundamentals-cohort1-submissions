const request = require('supertest');
const app = require('../../src/app');
const {
  assertSuccessResponse,
  assertErrorResponse
} = require('../helpers/testUtils');

describe('User API - Integration Tests', () => {
  let createdUserId;

  describe('POST /api/users', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'Integration Test User',
        email: `integration${Date.now()}@example.com`,
        balance: 5000
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      assertSuccessResponse(response, 201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.balance).toBe(userData.balance);

      createdUserId = response.body.data.id;
    });

    it('should reject user with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        balance: 1000
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      assertErrorResponse(response, 400);
    });

    it('should reject user with negative balance', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        balance: -100
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      assertErrorResponse(response, 400);
    });

    it('should reject user with missing required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Test User' })
        .expect(400);

      assertErrorResponse(response, 400);
    });

    it('should reject duplicate email', async () => {
      const email = `duplicate${Date.now()}@example.com`;
      
      // Create first user
      await request(app)
        .post('/api/users')
        .send({
          name: 'User 1',
          email: email,
          balance: 1000
        });

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/users')
        .send({
          name: 'User 2',
          email: email,
          balance: 2000
        })
        .expect(409);

      assertErrorResponse(response, 409, 'already exists');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      // First create a user
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Get Test User',
          email: `gettest${Date.now()}@example.com`,
          balance: 1000
        });

      const userId = createResponse.body.data.id;

      // Get the user
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      assertSuccessResponse(response);
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('email');
      expect(response.body.data).toHaveProperty('balance');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/99999')
        .expect(404);

      assertErrorResponse(response, 404, 'not found');
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app)
        .get('/api/users/invalid-id')
        .expect(400);

      assertErrorResponse(response, 400);
    });
  });

  describe('GET /api/users', () => {
    beforeAll(async () => {
      // Create multiple users for listing tests
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/users')
          .send({
            name: `List Test User ${i}`,
            email: `listtest${i}${Date.now()}@example.com`,
            balance: 1000 * (i + 1)
          });
      }
    });

    it('should list all users with pagination', async () => {
      const response = await request(app)
        .get('/api/users')
        .query({ page: 1, limit: 10 })
        .expect(200);

      assertSuccessResponse(response);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
    });

    it('should filter users by search query', async () => {
      const response = await request(app)
        .get('/api/users')
        .query({ search: 'List Test' })
        .expect(200);

      assertSuccessResponse(response);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      const response = await request(app)
        .get('/api/users')
        .query({ page: 1, limit: 2 })
        .expect(200);

      assertSuccessResponse(response);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination.limit).toBe(2);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      // Create a user
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Update Test User',
          email: `updatetest${Date.now()}@example.com`,
          balance: 1000
        });

      const userId = createResponse.body.data.id;

      // Update the user
      const updateData = {
        name: 'Updated Name',
        balance: 2000
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      assertSuccessResponse(response);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.balance).toBe(updateData.balance);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/api/users/99999')
        .send({ name: 'Updated Name' })
        .expect(404);

      assertErrorResponse(response, 404);
    });

    it('should reject invalid update data', async () => {
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          balance: 1000
        });

      const userId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send({ balance: -500 })
        .expect(400);

      assertErrorResponse(response, 400);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      // Create a user
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          name: 'Delete Test User',
          email: `deletetest${Date.now()}@example.com`,
          balance: 1000
        });

      const userId = createResponse.body.data.id;

      // Delete the user
      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      assertSuccessResponse(response);
      expect(response.body.data).toHaveProperty('message');

      // Verify user is deleted
      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/users/99999')
        .expect(404);

      assertErrorResponse(response, 404);
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      // This would require mocking to simulate server errors
      // For now, we test that error responses follow the correct format
      const response = await request(app)
        .get('/api/users/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      assertErrorResponse(response, 400);
    });
  });
});
