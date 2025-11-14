import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart, loading } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await updateCartItem(item.productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeFromCart(item.productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
      <div className="flex-shrink-0">
        <img
          src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
          alt={item.name}
          className="h-20 w-20 object-cover rounded-md"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          {item.description}
        </p>
        <p className="text-lg font-semibold text-blue-600">
          ${item.price.toFixed(2)}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || loading || item.quantity <= 1}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        
        <span className="text-lg font-medium w-8 text-center">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating || loading}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-lg font-semibold text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        
        <button
          onClick={handleRemove}
          disabled={isUpdating || loading}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
