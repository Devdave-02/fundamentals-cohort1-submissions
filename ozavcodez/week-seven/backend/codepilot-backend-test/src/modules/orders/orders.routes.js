const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const { authenticate } = require('../auth/auth.middleware');

// All order routes require authentication
router.use(authenticate);

router.post('/', ordersController.createOrder);
router.get('/stats', ordersController.getOrderStats);
router.get('/', ordersController.getAllOrders);
router.get('/:id', ordersController.getOrderById);
router.patch('/:id/status', ordersController.updateOrderStatus);
router.post('/:id/cancel', ordersController.cancelOrder);

module.exports = router;
