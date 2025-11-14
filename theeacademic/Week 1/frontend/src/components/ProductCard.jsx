import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart, loading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAdding(true);
    try {
      const result = await addToCart(product._id, 1);
      if (result.success) {
        alert('Item added to cart successfully!');
      } else {
        alert(result.error || 'Failed to add item to cart');
      }
    } catch (error) {
      alert('An error occurred while adding item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding || loading || product.stock === 0}
            className={`flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isAdding || loading
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span>
              {product.stock === 0
                ? 'Out of Stock'
                : isAdding || loading
                ? 'Adding...'
                : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
