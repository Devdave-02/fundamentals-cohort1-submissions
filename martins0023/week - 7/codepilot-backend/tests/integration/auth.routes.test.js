const request = require('supertest');
const app = require('../../src/app'); // <-- THIS IS THE CORRECT IMPORT
// const server = require('../../src/server'); // <-- WRONG IMPORT, REMOVED
const authService = require('../../src/modules/auth/auth.service');

describe('Auth API (Integration Tests)', () => {

  // Clean the mock DB before each test
  beforeEach(() => {
    authService.__cleanupMockDb();
  });

  // REMOVED: The afterAll block that closed the server

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and return 201', async () => {
      const res = await request(app) // Use app
        .post('/api/v1/auth/register')
        .send({ username: 'newuser', password: 'password123' })
        .expect('Content-Type', /json/)
        .expect(201);
      // ... (rest of test)
    });

    it('should return 409 if username is taken', async () => {
      await authService.registerUser('existinguser', 'password123');
      await request(app) // Use app
        .post('/api/v1/auth/register')
        .send({ username: 'existinguser', password: 'password123' })
        .expect('Content-Type', /json/)
        .expect(409); 
    });

    it('should return 400 if data is missing', async () => {
      await request(app) // Use app
        .post('/api/v1/auth/register')
        .send({ username: 'user' }) 
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await authService.registerUser('testuser', 'goodpassword');
    });

    it('should login and return a token with 200', async () => {
      const res = await request(app) // Use app
        .post('/api/v1/auth/login')
        .send({ username: 'testuser', password: 'goodpassword' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.token).toBeDefined();
    });

    it('should return 401 for incorrect password', async () => {
      await request(app) // Use app
        .post('/api/v1/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .expect('Content-Type', /json/)
        .expect(401);
    });

    it('should return 401 for non-existent user', async () => {
      await request(app) // Use app
        .post('/api/v1/auth/login')
        .send({ username: 'nouser', password: 'password' })
        .expect('Content-Type', /json/)
        .expect(401);
    });
  });
});