const express = require('express');
const { body, validationResult } = require('express-validator');
const productService = require('../services/productService');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice
    };
    const products = productService.getAllProducts(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const product = productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/',
  authenticate,
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('category').notEmpty().withMessage('Category is required')
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.put('/:id', authenticate, (req, res) => {
  try {
    const product = productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    productService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
