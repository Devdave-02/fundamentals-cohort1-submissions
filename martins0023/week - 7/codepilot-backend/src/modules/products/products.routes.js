const express = require('express');
const router = express.Router();
const controller = require('./products.controller');

// GET /api/v1/products
router.get('/', controller.getProducts);

// GET /api/v1/products/:id
router.get('/:id', controller.getProduct);

module.exports = router;