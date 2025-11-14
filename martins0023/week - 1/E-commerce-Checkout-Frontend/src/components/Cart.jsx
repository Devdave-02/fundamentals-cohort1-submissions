import React from 'react';
import { cartAPI } from '../services/api';

const Cart = ({ cart, onCartUpdate }) => {
  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await cartAPI.updateCartItem({
        userId: 'demo-user-123',
        productId,
        quantity: newQuantity
      });
      onCartUpdate();
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartAPI.removeFromCart({
        userId: 'demo-user-123',
        productId
      });
      onCartUpdate();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartAPI.clearCart('demo-user-123');
      onCartUpdate();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart">
        <h2>Your Cart</h2>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button onClick={handleClearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>
      
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.productId} className="cart-item">
            <img src={item.image} alt={item.productName} />
            <div className="item-details">
              <h4>{item.productName}</h4>
              <p>${item.price.toFixed(2)}</p>
            </div>
            <div className="quantity-controls">
              <button 
                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            <button 
              onClick={() => handleRemoveItem(item.productId)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-total">
        <h3>Total: ${cart.totalAmount.toFixed(2)}</h3>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;