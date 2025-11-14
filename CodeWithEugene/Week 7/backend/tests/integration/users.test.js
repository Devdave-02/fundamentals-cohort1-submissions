const request = require('supertest');
const app = require('../../src/server');
const authService = require('../../src/services/authService');

describe('Users Routes - Integration Tests', () => {
  let authToken;

  beforeEach(async () => {
    const result = await authService.register('user@example.com', 'password123', 'Test User');
    authToken = result.token;
  });

  describe('GET /api/users/profile', () => {
    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('name');
      expect(response.body.email).toBe('user@example.com');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
    });

    it('should update user email', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'newemail@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('newemail@example.com');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(401);
    });
  });
});
