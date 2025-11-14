const express = require('express');
const router = express.Router();
const productsController = require('./products.controller');
const { authenticate } = require('../auth/auth.middleware');

router.post('/', authenticate, productsController.createProduct);
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.put('/:id', authenticate, productsController.updateProduct);
router.delete('/:id', authenticate, productsController.deleteProduct);

module.exports = router;
