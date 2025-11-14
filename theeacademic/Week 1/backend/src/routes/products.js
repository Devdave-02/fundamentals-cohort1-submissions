const express = require('express');
const { body } = require('express-validator');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  getCategories 
} = require('../controllers/productController');

const router = express.Router();

// Validation rules for creating products
const createProductValidation = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .trim(),
  body('description')
    .notEmpty()
    .withMessage('Product description is required')
    .trim(),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .notEmpty()
    .withMessage('Product category is required')
    .trim(),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

// Routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/', createProductValidation, createProduct);

module.exports = router;
