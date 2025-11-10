const request = require('supertest');
const app = require('../../src/app');
const authService = require('../../src/modules/auth/auth.service');
const productsService = require('../../src/modules/products/products.service');
const ordersService = require('../../src/modules/orders/orders.service');
const { ORDER_STATUS } = require('../../src/modules/orders/orders.service');

describe('Orders Routes - Integration Tests', () => {
  let token, userId, product1, product2;

  beforeEach(async () => {
    authService.clearUsers();
    productsService.clearProducts();
    ordersService.clearOrders();

    // Register and login a user
    const authResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    token = authResponse.body.data.token;
    userId = authResponse.body.data.user.id;

    // Create test products
    const product1Response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Laptop',
        price: 1299.99,
        stock: 10,
        category: 'electronics'
      });

    const product2Response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Mouse',
        price: 29.99,
        stock: 20,
        category: 'electronics'
      });

    product1 = product1Response.body.data;
    product2 = product2Response.body.data;
  });

  describe('POST /api/orders', () => {
    it('should create an order with authentication', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [
            { productId: product1.id, quantity: 2 },
            { productId: product2.id, quantity: 1 }
          ],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001'
          }
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.userId).toBe(userId);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.total).toBe(2629.97);
      expect(response.body.data.status).toBe(ORDER_STATUS.PENDING);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          items: [{ productId: product1.id, quantity: 1 }],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York'
          }
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid order data', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [],
          shippingAddress: {}
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for insufficient stock', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId: product1.id, quantity: 100 }],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York'
          }
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should update product stock after order creation', async () => {
      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId: product1.id, quantity: 2 }],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York'
          }
        });

      const productResponse = await request(app)
        .get(`/api/products/${product1.id}`);

      expect(productResponse.body.data.stock).toBe(8); // 10 - 2
    });
  });

  describe('GET /api/orders', () => {
    beforeEach(async () => {
      // Create test orders
      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId: product1.id, quantity: 1 }],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York'
          }
        });

      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId: product2.id, quantity: 1 }],
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Boston'
          }
        });
    });

    it('should get user orders with authentication', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every(o => o.userId === userId)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/orders');

      expect(response.status).toBe(401);
    });

    it('should filter orders by status', async () => {
      const orders = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      const orderId = orders.body.data[0].id;

      await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: ORDER_STATUS.PROCESSING });

      const response = await request(app)
        .get('/api/orders?status=processing')
        .set('Authorization', `Bearer ${token}`);

      expect(response.body.count).toBe(1);
      expect(response.body.data[0].status).toBe(ORDER_STATUS.PROCESSING);
    });
  });

  describe('GET /api/orders/:id', () => {
    let orderId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId: product1.id, quantity: 1 }],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York'
          }
        });

      orderId = response.body.data.id;
    });

    it('should get order by ID with authentication', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(orderId);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`);

      expect(response.status).toBe(401);
    });

    it('should return 403 when accessing another user order', async () => {
      // Create another user
      const anotherUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'another@example.com',
          password: 'password123',
          name: 'Another User'
        });

      const anotherToken = anotherUserResponse.body.data.token;

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${anotherToken}`);

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    let orderId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId: product1.id, quantity: 1 }],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York'
          }
        });

      orderId = response.body.data.id;
    });

    it('should update order status with authentication', async () => {
      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: ORDER_STATUS.PROCESSING });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(ORDER_STATUS.PROCESSING);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: ORDER_STATUS.PROCESSING });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'invalid_status' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/orders/:id/cancel', () => {
    let orderId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId: product1.id, quantity: 2 }],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York'
          }
        });

      orderId = response.body.data.id;
    });

    it('should cancel order with authentication', async () => {
      const response = await request(app)
        .post(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(ORDER_STATUS.CANCELLED);
    });

    it('should restore product stock after cancellation', async () => {
      await request(app)
        .post(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      const productResponse = await request(app)
        .get(`/api/products/${product1.id}`);

      expect(productResponse.body.data.stock).toBe(10); // Restored to original
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post(`/api/orders/${orderId}/cancel`);

      expect(response.status).toBe(401);
    });

    it('should return 400 when cancelling shipped order', async () => {
      await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: ORDER_STATUS.SHIPPED });

      const response = await request(app)
        .post(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/orders/stats', () => {
    beforeEach(async () => {
      // Create multiple orders with different statuses
      const order1Response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId: product1.id, quantity: 1 }],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York'
          }
        });

      const order2Response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId: product2.id, quantity: 1 }],
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Boston'
          }
        });

      await request(app)
        .patch(`/api/orders/${order1Response.body.data.id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: ORDER_STATUS.DELIVERED });

      await request(app)
        .post(`/api/orders/${order2Response.body.data.id}/cancel`)
        .set('Authorization', `Bearer ${token}`);
    });

    it('should get order statistics with authentication', async () => {
      const response = await request(app)
        .get('/api/orders/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(2);
      expect(response.body.data.delivered).toBe(1);
      expect(response.body.data.cancelled).toBe(1);
      expect(response.body.data.totalRevenue).toBe(1299.99); // Only delivered order
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/orders/stats');

      expect(response.status).toBe(401);
    });
  });
});
