const express = require('express');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

// Cart routes
router.post('/add-to-cart', addToCart);
router.get('/get-cart/:userId', getCart);
router.put('/update-item', updateCartItem);
router.delete('/remove-item', removeFromCart);
router.delete('/clear/:userId', clearCart);

module.exports = router;