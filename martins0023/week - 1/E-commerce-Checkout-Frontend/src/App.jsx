import React, { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import { cartAPI } from './services/api';
import './App.css';

function App() {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [activeTab, setActiveTab] = useState('products');

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart('demo-user-123');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>E-Commerce Store</h1>
        <nav>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={activeTab === 'cart' ? 'active' : ''}
            onClick={() => setActiveTab('cart')}
          >
            Cart ({cart.items.length})
          </button>
        </nav>
      </header>

      <main className="main-content">
        {activeTab === 'products' && (
          <ProductList onCartUpdate={fetchCart} />
        )}
        {activeTab === 'cart' && (
          <Cart cart={cart} onCartUpdate={fetchCart} />
        )}
      </main>
    </div>
  );
}

export default App;