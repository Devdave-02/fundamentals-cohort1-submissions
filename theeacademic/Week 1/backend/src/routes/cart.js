const express = require('express');
const { body, param } = require('express-validator');
const { 
  addToCart, 
  getCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const auth = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(auth);

// Validation rules
const addToCartValidation = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
];

const updateCartItemValidation = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
];

const removeFromCartValidation = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID')
];

// Routes
router.post('/add-to-cart', addToCartValidation, addToCart);
router.get('/get-cart/:userId', getCart);
router.put('/update-item/:productId', updateCartItemValidation, updateCartItem);
router.delete('/remove-item/:productId', removeFromCartValidation, removeFromCart);
router.delete('/clear-cart', clearCart);

module.exports = router;
