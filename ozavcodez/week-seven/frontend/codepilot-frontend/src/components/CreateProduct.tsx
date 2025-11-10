import { useState } from 'react';
import * as api from '../services/api';
import type { Product } from '../services/api';

interface CreateProductProps {
  token: string;
  onProductCreated: () => void;
}

export default function CreateProduct({ token, onProductCreated }: CreateProductProps) {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const result = await api.createProduct(productData, token);
      
      if (result.success && result.data) {
        setMessage('Product created successfully!');
        // Reset form
        setProductData({
          name: '',
          description: '',
          price: 0,
          stock: 0,
          category: '',
        });
        // Notify parent to refresh products list
        onProductCreated();
      } else {
        setError(result.error || 'Failed to create product');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="create-product">
      <h3>Create New Product</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={productData.description}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </label>
        </div>
        <div>
          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={productData.stock}
              onChange={handleChange}
              min="0"
              required
              disabled={loading}
            />
          </label>
        </div>
        <div>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}