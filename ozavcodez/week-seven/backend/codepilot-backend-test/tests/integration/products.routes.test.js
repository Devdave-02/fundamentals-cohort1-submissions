const request = require('supertest');
const app = require('../../src/app');
const authService = require('../../src/modules/auth/auth.service');
const productsService = require('../../src/modules/products/products.service');

describe('Products Routes - Integration Tests', () => {
  let token;

  beforeEach(async () => {
    authService.clearUsers();
    productsService.clearProducts();

    // Register and login a user
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    token = response.body.data.token;
  });

  describe('POST /api/products', () => {
    it('should create a product with authentication', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Laptop',
          description: 'High-end laptop',
          price: 1299.99,
          stock: 10,
          category: 'electronics'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Laptop');
      expect(response.body.data.price).toBe(1299.99);
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'Laptop',
          price: 1299.99,
          stock: 10
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid product data', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          price: -1,
          stock: 10
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Create test products
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Laptop',
          description: 'High-end laptop',
          price: 1299.99,
          stock: 10,
          category: 'electronics'
        });

      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Mouse',
          description: 'Wireless mouse',
          price: 29.99,
          stock: 0,
          category: 'electronics'
        });

      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Desk',
          description: 'Standing desk',
          price: 499.99,
          stock: 5,
          category: 'furniture'
        });
    });

    it('should get all products without authentication', async () => {
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=electronics');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every(p => p.category === 'electronics')).toBe(true);
    });

    it('should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=100&maxPrice=500');

      expect(response.status).toBe(200);
      expect(response.body.data.every(p => p.price >= 100 && p.price <= 500)).toBe(true);
    });

    it('should filter products by stock availability', async () => {
      const response = await request(app)
        .get('/api/products?inStock=true');

      expect(response.status).toBe(200);
      expect(response.body.data.every(p => p.stock > 0)).toBe(true);
    });
  });

  describe('GET /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Laptop',
          price: 1299.99,
          stock: 10
        });

      productId = response.body.data.id;
    });

    it('should get product by ID', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(productId);
      expect(response.body.data.name).toBe('Laptop');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Laptop',
          price: 1299.99,
          stock: 10
        });

      productId = response.body.data.id;
    });

    it('should update product with authentication', async () => {
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Gaming Laptop',
          price: 1499.99
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Gaming Laptop');
      expect(response.body.data.price).toBe(1499.99);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send({
          price: 999.99
        });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .put('/api/products/nonexistent')
        .set('Authorization', `Bearer ${token}`)
        .send({
          price: 999.99
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Laptop',
          price: 1299.99,
          stock: 10
        });

      productId = response.body.data.id;
    });

    it('should delete product with authentication', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify product is deleted
      const getResponse = await request(app)
        .get(`/api/products/${productId}`);

      expect(getResponse.status).toBe(404);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`);

      expect(response.status).toBe(401);
    });
  });
});
