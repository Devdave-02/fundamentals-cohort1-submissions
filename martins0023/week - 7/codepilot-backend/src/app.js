const express = require('express');
const cors = require('cors');
const app = express();

// --- Import Routes ---
const authRoutes = require('./modules/auth/auth.routes');
const productRoutes = require('./modules/products/products.routes');
const orderRoutes = require('./modules/orders/orders.routes');

// --- Middleware ---

// 1. Enable CORS for all origins (allows frontend to connect)
app.use(cors());

// 2. Enable JSON body parsing
app.use(express.json());

// --- API Routes ---
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Welcome to the CodePilot API',
    strategy: 'Test for coverage and confidence!'
  });
});

// Wire up module routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// --- Error Handling ---

// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// 500 General Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;