const request = require('supertest');
const app = require('../../src/app');
// We only import these to clean the DB before tests run
const authService = require('../../src/modules/auth/auth.service');
const orderService = require('../../src/modules/orders/orders.service');

describe('Orders API (Integration Tests)', () => {
  let testToken;
  let testUser;

  // --- SETUP ---
  beforeAll(async () => {
    // 1. Clean the mock databases so we start fresh
    authService.__cleanupMockDb();
    orderService.__cleanupMockDb();
    
    // 2. Register a user by acting like a real client (making an HTTP POST)
    // This ensures the backend handles everything normally.
    const userResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({ username: 'orderUser', password: 'password123' });
    
    testUser = userResponse.body;

    // 3. Login as that user via HTTP POST to get the token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'orderUser', password: 'password123' });

    // 4. Save the token for the rest of the tests
    testToken = loginResponse.body.token;
  });

  // --- TESTS ---
  describe('POST /api/v1/orders (Protected)', () => {
    it('should return 401 if no token is provided', async () => {
      await request(app)
        .post('/api/v1/orders')
        .send({ items: [{ productId: 1, quantity: 1 }] })
        .expect(401);
    });

    it('should return 401 for an invalid token', async () => {
      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', 'Bearer badtoken')
        .send({ items: [{ productId: 1, quantity: 1 }] })
        .expect(401);
    });

    it('should create an order and return 201 with a valid token', async () => {
      const orderData = {
        // Product 1 matches the mock data in products.service.js
        items: [{ productId: 1, quantity: 2 }] 
      };

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${testToken}`) // Use the real token
        .send(orderData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.userId).toBe(testUser.id);
      // 99.99 * 2 = 199.98
      expect(res.body.total).toBe(199.98);
    });

    it('should return 400 for bad order data (e.g., product not found)', async () => {
      const orderData = {
        items: [{ productId: 999, quantity: 1 }]
      };

      await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${testToken}`)
        .send(orderData)
        .expect(400);
    });
  });

  describe('GET /api/v1/orders (Protected)', () => {
    it('should return 401 if no token is provided', async () => {
      await request(app)
        .get('/api/v1/orders')
        .expect(401);
    });

    it('should return orders for the authenticated user', async () => {
      // This test relies on the order created in the POST test above
      const res = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${testToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
      expect(res.body[0]).toHaveProperty('total');
    });
  });
});