const request = require('supertest');
const app = require('../../src/app'); // <-- THIS IS THE CORRECT IMPORT
// const server = require('../../src/server'); // <-- WRONG IMPORT, REMOVED

describe('Products API (Integration Tests)', () => {

  // REMOVED: The afterAll block that closed the server

  describe('GET /api/v1/products', () => {
    it('should return 200 OK and a list of products', async () => {
      const res = await request(app) // Use app
        .get('/api/v1/products')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toBe('CodePilot Pro');
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return 200 OK and a single product for a valid ID', async () => {
      const res = await request(app) // Use app
        .get('/api/v1/products/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.id).toBe(1);
    });

    it('should return 404 Not Found for a non-existent ID', async () => {
      await request(app) // Use app
        .get('/api/v1/products/999')
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should return 400 Bad Request for an invalid ID', async () => {
      await request(app) // Use app
        .get('/api/v1/products/abc')
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });
});