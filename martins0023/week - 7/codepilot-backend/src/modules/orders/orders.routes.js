const express = require('express');
const router = express.Router();
const controller = require('./orders.controller');
const checkAuth = require('../../middleware/checkAuth'); // Import the auth middleware

// --- PROTECTED ROUTES ---
// We add the `checkAuth` middleware before the controller.
// Only requests with a valid JWT will pass this.

// POST /api/v1/orders
router.post('/', checkAuth, controller.placeOrder);

// GET /api/v1/orders
router.get('/', checkAuth, controller.getUserOrders);

module.exports = router;