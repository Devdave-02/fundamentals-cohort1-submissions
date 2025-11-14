const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

// Setup a test database connection
beforeAll(async () => {
    const url = `mongodb+srv://martinsmiracle45_db_user:BCnVHD3fgvSzbxuQ@e-commerce-checkout-sys.5shfdko.mongodb.net/?retryWrites=true&w=majority&appName=E-commerce-Checkout-System`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clean up the database after each test
afterEach(async () => {
    await User.deleteMany();
});

// Close the connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth API', () => {
    it('should signup a new user and return a token', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.username).toBe('testuser');
    });

    it('should not signup a user with an existing email', async () => {
        await User.create({
            username: 'testuser1',
            email: 'test@example.com',
            password: 'password123'
        });
        
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                username: 'testuser2',
                email: 'test@example.com',
                password: 'password456',
            });
        expect(res.statusCode).toEqual(400);
    });
    
    it('should login an existing user and return a token', async () => {
        const user = new User({ username: 'loginuser', email: 'login@example.com', password: 'password123' });
        await user.save();
        
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});