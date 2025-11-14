import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { cartAPI } from '../services/api';

const ProductList = ({ onCartUpdate }) => {
  const [products] = useState([
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
    },
    {
      id: '3',
      name: 'Laptop Stand',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop'
    },
    {
      id: '4',
      name: 'USB-C Hub',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop'
    }
  ]);

  const handleAddToCart = async (product) => {
    try {
      const cartItem = {
        userId: 'demo-user-123',
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      };

      await cartAPI.addToCart(cartItem);
      onCartUpdate();
      alert('Item added to cart!');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;