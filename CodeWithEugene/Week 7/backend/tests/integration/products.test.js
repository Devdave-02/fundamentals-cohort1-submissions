const request = require('supertest');
const app = require('../../src/server');
const authService = require('../../src/services/authService');

describe('Products Routes - Integration Tests', () => {
  let authToken;

  beforeEach(async () => {
    // Register and login to get token
    const result = await authService.register('test@example.com', 'password123', 'Test User');
    authToken = result.token;
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=Electronics');

      expect(response.status).toBe(200);
      response.body.forEach(product => {
        expect(product.category).toBe('Electronics');
      });
    });

    it('should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=50&maxPrice=100');

      expect(response.status).toBe(200);
      response.body.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(50);
        expect(product.price).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a specific product', async () => {
      const response = await request(app)
        .get('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Product not found');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product with valid token', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'New Product',
          price: 199.99,
          stock: 10,
          category: 'Electronics'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('New Product');
      expect(response.body.price).toBe(199.99);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'New Product',
          price: 199.99,
          category: 'Electronics'
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid product data', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '',
          price: -10,
          category: 'Electronics'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product with valid token', async () => {
      const response = await request(app)
        .put('/api/products/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Product',
          price: 299.99
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Product');
      expect(response.body.price).toBe(299.99);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/api/products/1')
        .send({ name: 'Updated' });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .put('/api/products/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product with valid token', async () => {
      // First create a product
      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'To Delete',
          price: 99.99,
          category: 'Test'
        });

      const productId = createResponse.body.id;

      // Then delete it
      const deleteResponse = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteResponse.status).toBe(204);

      // Verify it's deleted
      const getResponse = await request(app)
        .get(`/api/products/${productId}`);

      expect(getResponse.status).toBe(404);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/products/1');

      expect(response.status).toBe(401);
    });
  });
});
