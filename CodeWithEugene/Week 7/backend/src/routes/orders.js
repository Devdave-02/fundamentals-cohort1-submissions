const express = require('express');
const { body, validationResult } = require('express-validator');
const orderService = require('../services/orderService');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/',
  authenticate,
  [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.productId').isInt().withMessage('Valid productId is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = orderService.createOrder(req.user.id, req.body.items);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.get('/', authenticate, (req, res) => {
  try {
    const orders = orderService.getAllOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticate, (req, res) => {
  try {
    const order = orderService.getOrderById(req.params.id, req.user.id);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.patch('/:id/status', authenticate, (req, res) => {
  try {
    const order = orderService.updateOrderStatus(req.params.id, req.body.status);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/cancel', authenticate, (req, res) => {
  try {
    const order = orderService.cancelOrder(req.params.id, req.user.id);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
