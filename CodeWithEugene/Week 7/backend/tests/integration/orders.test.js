const request = require('supertest');
const app = require('../../src/server');
const authService = require('../../src/services/authService');

describe('Orders Routes - Integration Tests', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    // Register and login to get token
    const result = await authService.register('order@example.com', 'password123', 'Order User');
    authToken = result.token;
    userId = result.user.id;
  });

  describe('POST /api/orders', () => {
    it('should create an order with valid items', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [
            { productId: 1, quantity: 2 },
            { productId: 2, quantity: 1 }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
      expect(response.body.status).toBe('pending');
      expect(response.body.items).toHaveLength(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          items: [{ productId: 1, quantity: 1 }]
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for empty items', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: []
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid item data', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [
            { productId: 'invalid', quantity: 1 }
          ]
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for non-existent product', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [
            { productId: 999, quantity: 1 }
          ]
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('GET /api/orders', () => {
    it('should return user orders', async () => {
      // Create an order first
      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId: 1, quantity: 1 }]
        });

      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach(order => {
        expect(order.userId).toBe(userId);
      });
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/orders');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return a specific order', async () => {
      // Create an order first
      const createResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId: 1, quantity: 1 }]
        });

      const orderId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(orderId);
      expect(response.body.userId).toBe(userId);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/orders/1');

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('should update order status', async () => {
      // Create an order first
      const createResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId: 1, quantity: 1 }]
        });

      const orderId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'shipped'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('shipped');
    });

    it('should return 400 for invalid status', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId: 1, quantity: 1 }]
        });

      const orderId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'invalid-status'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/orders/:id/cancel', () => {
    it('should cancel an order', async () => {
      // Create an order first
      const createResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId: 1, quantity: 1 }]
        });

      const orderId = createResponse.body.id;

      const response = await request(app)
        .post(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('cancelled');
    });
  });
});
