const request = require('supertest');
const app = require('../../src/server');

describe('E2E Workflow Tests', () => {
  let authToken;
  let userId;
  let productId;
  let orderId;

  describe('Complete User Journey', () => {
    it('should complete full workflow: register -> login -> view products -> create order -> view order -> update profile', async () => {
      // Step 1: Register a new user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'workflow@example.com',
          password: 'password123',
          name: 'Workflow User'
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body).toHaveProperty('token');
      authToken = registerResponse.body.token;
      userId = registerResponse.body.user.id;

      // Step 2: Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'workflow@example.com',
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');

      // Step 3: Get user profile
      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(profileResponse.status).toBe(200);
      expect(profileResponse.body.email).toBe('workflow@example.com');

      // Step 4: View all products
      const productsResponse = await request(app)
        .get('/api/products');

      expect(productsResponse.status).toBe(200);
      expect(Array.isArray(productsResponse.body)).toBe(true);
      expect(productsResponse.body.length).toBeGreaterThan(0);

      // Step 5: Get a specific product
      productId = productsResponse.body[0].id;
      const productResponse = await request(app)
        .get(`/api/products/${productId}`);

      expect(productResponse.status).toBe(200);
      expect(productResponse.body.id).toBe(productId);

      // Step 6: Create an order
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [
            { productId: productId, quantity: 2 }
          ]
        });

      expect(orderResponse.status).toBe(201);
      expect(orderResponse.body).toHaveProperty('id');
      expect(orderResponse.body.items).toHaveLength(1);
      orderId = orderResponse.body.id;

      // Step 7: View the order
      const viewOrderResponse = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(viewOrderResponse.status).toBe(200);
      expect(viewOrderResponse.body.id).toBe(orderId);
      expect(viewOrderResponse.body.userId).toBe(userId);

      // Step 8: View all user orders
      const allOrdersResponse = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(allOrdersResponse.status).toBe(200);
      expect(Array.isArray(allOrdersResponse.body)).toBe(true);
      expect(allOrdersResponse.body.length).toBeGreaterThan(0);

      // Step 9: Update user profile
      const updateProfileResponse = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Workflow User'
        });

      expect(updateProfileResponse.status).toBe(200);
      expect(updateProfileResponse.body.name).toBe('Updated Workflow User');

      // Step 10: Update order status
      const updateStatusResponse = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'shipped'
        });

      expect(updateStatusResponse.status).toBe(200);
      expect(updateStatusResponse.body.status).toBe('shipped');
    });

    it('should handle order cancellation workflow', async () => {
      // Register and login
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'cancel@example.com',
          password: 'password123',
          name: 'Cancel User'
        });

      const token = registerResponse.body.token;

      // Get products
      const productsResponse = await request(app)
        .get('/api/products');

      const productId = productsResponse.body[0].id;
      const initialStock = productsResponse.body[0].stock;

      // Create order
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ productId, quantity: 1 }]
        });

      const orderId = orderResponse.body.id;

      // Cancel order
      const cancelResponse = await request(app)
        .post(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${token}`);

      expect(cancelResponse.status).toBe(200);
      expect(cancelResponse.body.status).toBe('cancelled');

      // Verify stock was restored
      const productAfterCancel = await request(app)
        .get(`/api/products/${productId}`);

      expect(productAfterCancel.body.stock).toBe(initialStock);
    });

    it('should handle product management workflow', async () => {
      // Register admin user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@example.com',
          password: 'password123',
          name: 'Admin User'
        });

      const token = registerResponse.body.token;

      // Create a product
      const createProductResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Product',
          price: 99.99,
          stock: 10,
          category: 'Test'
        });

      expect(createProductResponse.status).toBe(201);
      const newProductId = createProductResponse.body.id;

      // Update the product
      const updateProductResponse = await request(app)
        .put(`/api/products/${newProductId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Test Product',
          price: 149.99
        });

      expect(updateProductResponse.status).toBe(200);
      expect(updateProductResponse.body.name).toBe('Updated Test Product');

      // Delete the product
      const deleteProductResponse = await request(app)
        .delete(`/api/products/${newProductId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteProductResponse.status).toBe(204);

      // Verify deletion
      const getProductResponse = await request(app)
        .get(`/api/products/${newProductId}`);

      expect(getProductResponse.status).toBe(404);
    });
  });
});
