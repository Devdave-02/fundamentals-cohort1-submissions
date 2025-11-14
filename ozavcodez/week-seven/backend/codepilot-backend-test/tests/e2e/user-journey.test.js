const request = require('supertest');
const app = require('../../src/app');
const authService = require('../../src/modules/auth/auth.service');
const productsService = require('../../src/modules/products/products.service');
const ordersService = require('../../src/modules/orders/orders.service');
const { ORDER_STATUS } = require('../../src/modules/orders/orders.service');

describe('E2E - Complete User Journey', () => {
  beforeEach(() => {
    authService.clearUsers();
    productsService.clearProducts();
    ordersService.clearOrders();
  });

  describe('Complete Shopping Flow', () => {
    it('should complete full user registration, product browsing, and order placement', async () => {
      // Step 1: User Registration
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'customer@example.com',
          password: 'securepass123',
          name: 'John Doe'
        });

      expect(registerResponse.status).toBe(201);
      const { token, user } = registerResponse.body.data;
      expect(token).toBeDefined();
      expect(user.email).toBe('customer@example.com');

      // Step 2: Admin creates products
      const product1Response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'MacBook Pro',
          description: '16-inch, M2 Pro',
          price: 2499.99,
          stock: 5,
          category: 'electronics'
        });

      expect(product1Response.status).toBe(201);
      const product1 = product1Response.body.data;

      const product2Response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Magic Mouse',
          description: 'Wireless mouse',
          price: 79.99,
          stock: 15,
          category: 'electronics'
        });

      expect(product2Response.status).toBe(201);
      const product2 = product2Response.body.data;

      // Step 3: User browses products
      const browseResponse = await request(app)
        .get('/api/products?category=electronics&inStock=true');

      expect(browseResponse.status).toBe(200);
      expect(browseResponse.body.count).toBe(2);

      // Step 4: User views specific product
      const productDetailResponse = await request(app)
        .get(`/api/products/${product1.id}`);

      expect(productDetailResponse.status).toBe(200);
      expect(productDetailResponse.body.data.name).toBe('MacBook Pro');

      // Step 5: User places an order
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [
            { productId: product1.id, quantity: 1 },
            { productId: product2.id, quantity: 2 }
          ],
          shippingAddress: {
            street: '123 Tech Street',
            city: 'San Francisco',
            state: 'CA',
            zip: '94102'
          }
        });

      expect(orderResponse.status).toBe(201);
      const order = orderResponse.body.data;
      expect(order.total).toBe(2659.97); // 2499.99 + (79.99 * 2)
      expect(order.status).toBe(ORDER_STATUS.PENDING);

      // Step 6: Verify stock was updated
      const updatedProduct1 = await request(app)
        .get(`/api/products/${product1.id}`);
      expect(updatedProduct1.body.data.stock).toBe(4); // 5 - 1

      const updatedProduct2 = await request(app)
        .get(`/api/products/${product2.id}`);
      expect(updatedProduct2.body.data.stock).toBe(13); // 15 - 2

      // Step 7: User views their orders
      const ordersResponse = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(ordersResponse.status).toBe(200);
      expect(ordersResponse.body.count).toBe(1);
      expect(ordersResponse.body.data[0].id).toBe(order.id);

      // Step 8: User views order details
      const orderDetailResponse = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(orderDetailResponse.status).toBe(200);
      expect(orderDetailResponse.body.data.items).toHaveLength(2);

      // Step 9: Order status is updated (by admin/system)
      const statusUpdateResponse = await request(app)
        .patch(`/api/orders/${order.id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: ORDER_STATUS.PROCESSING });

      expect(statusUpdateResponse.status).toBe(200);
      expect(statusUpdateResponse.body.data.status).toBe(ORDER_STATUS.PROCESSING);

      // Step 10: User checks order statistics
      const statsResponse = await request(app)
        .get('/api/orders/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(statsResponse.status).toBe(200);
      expect(statsResponse.body.data.total).toBe(1);
      expect(statsResponse.body.data.processing).toBe(1);
      expect(statsResponse.body.data.totalRevenue).toBe(2659.97);
    });
  });

  describe('Order Cancellation Flow', () => {
    it('should handle order cancellation and stock restoration', async () => {
      // Setup: Register user and create products
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'password123',
          name: 'Test User'
        });

      const token = registerResponse.body.data.token;

      const productResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Laptop',
          price: 1299.99,
          stock: 10,
          category: 'electronics'
        });

      const product = productResponse.body.data;

      // Step 1: Create an order
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId: product.id, quantity: 3 }],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001'
          }
        });

      expect(orderResponse.status).toBe(201);
      const order = orderResponse.body.data;

      // Step 2: Verify stock was reduced
      const productAfterOrder = await request(app)
        .get(`/api/products/${product.id}`);
      expect(productAfterOrder.body.data.stock).toBe(7); // 10 - 3

      // Step 3: Cancel the order
      const cancelResponse = await request(app)
        .post(`/api/orders/${order.id}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(cancelResponse.status).toBe(200);
      expect(cancelResponse.body.data.status).toBe(ORDER_STATUS.CANCELLED);

      // Step 4: Verify stock was restored
      const productAfterCancel = await request(app)
        .get(`/api/products/${product.id}`);
      expect(productAfterCancel.body.data.stock).toBe(10); // Restored

      // Step 5: Verify order statistics
      const statsResponse = await request(app)
        .get('/api/orders/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(statsResponse.body.data.cancelled).toBe(1);
      expect(statsResponse.body.data.totalRevenue).toBe(0); // Cancelled orders don't count
    });
  });

  describe('Multiple Users Flow', () => {
    it('should handle multiple users with separate orders', async () => {
      // Register User 1
      const user1Response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user1@example.com',
          password: 'password123',
          name: 'User One'
        });

      const token1 = user1Response.body.data.token;
      const userId1 = user1Response.body.data.user.id;

      // Register User 2
      const user2Response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user2@example.com',
          password: 'password123',
          name: 'User Two'
        });

      const token2 = user2Response.body.data.token;
      const userId2 = user2Response.body.data.user.id;

      // Create products
      const productResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          name: 'Laptop',
          price: 999.99,
          stock: 20,
          category: 'electronics'
        });

      const product = productResponse.body.data;

      // User 1 creates an order
      const order1Response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          items: [{ productId: product.id, quantity: 2 }],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York'
          }
        });

      expect(order1Response.status).toBe(201);
      const order1 = order1Response.body.data;

      // User 2 creates an order
      const order2Response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          items: [{ productId: product.id, quantity: 1 }],
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Boston'
          }
        });

      expect(order2Response.status).toBe(201);
      const order2 = order2Response.body.data;

      // User 1 should only see their orders
      const user1OrdersResponse = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token1}`);

      expect(user1OrdersResponse.body.count).toBe(1);
      expect(user1OrdersResponse.body.data[0].userId).toBe(userId1);

      // User 2 should only see their orders
      const user2OrdersResponse = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token2}`);

      expect(user2OrdersResponse.body.count).toBe(1);
      expect(user2OrdersResponse.body.data[0].userId).toBe(userId2);

      // User 2 should not be able to access User 1's order
      const unauthorizedAccessResponse = await request(app)
        .get(`/api/orders/${order1.id}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(unauthorizedAccessResponse.status).toBe(403);

      // Verify stock was updated correctly
      const productAfterOrders = await request(app)
        .get(`/api/products/${product.id}`);
      expect(productAfterOrders.body.data.stock).toBe(17); // 20 - 2 - 1
    });
  });

  describe('Product Management Flow', () => {
    it('should handle complete product lifecycle', async () => {
      // Register admin user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@example.com',
          password: 'adminpass123',
          name: 'Admin User'
        });

      const token = registerResponse.body.data.token;

      // Create product
      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'iPhone 15',
          description: 'Latest iPhone',
          price: 999.99,
          stock: 50,
          category: 'electronics'
        });

      expect(createResponse.status).toBe(201);
      const product = createResponse.body.data;

      // Update product
      const updateResponse = await request(app)
        .put(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          price: 899.99,
          stock: 60
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.data.price).toBe(899.99);
      expect(updateResponse.body.data.stock).toBe(60);

      // Browse products
      const browseResponse = await request(app)
        .get('/api/products?category=electronics');

      expect(browseResponse.status).toBe(200);
      expect(browseResponse.body.count).toBeGreaterThan(0);

      // Delete product
      const deleteResponse = await request(app)
        .delete(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteResponse.status).toBe(200);

      // Verify product is deleted
      const getDeletedResponse = await request(app)
        .get(`/api/products/${product.id}`);

      expect(getDeletedResponse.status).toBe(404);
    });
  });

  describe('Authentication Flow', () => {
    it('should handle complete authentication lifecycle', async () => {
      // Register
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User'
        });

      expect(registerResponse.status).toBe(201);
      const { token: registerToken, user } = registerResponse.body.data;
      expect(registerToken).toBeDefined();

      // Access protected route with registration token
      const meResponse1 = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${registerToken}`);

      expect(meResponse1.status).toBe(200);
      expect(meResponse1.body.data.email).toBe('newuser@example.com');

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      const { token: loginToken } = loginResponse.body.data;
      expect(loginToken).toBeDefined();

      // Access protected route with login token
      const meResponse2 = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${loginToken}`);

      expect(meResponse2.status).toBe(200);
      expect(meResponse2.body.data.id).toBe(user.id);

      // Attempt to access without token
      const unauthorizedResponse = await request(app)
        .get('/api/auth/me');

      expect(unauthorizedResponse.status).toBe(401);
    });
  });
});
