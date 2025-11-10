import { useState } from 'react';
import { useProducts } from '../hooks/useApi';
import CreateProduct from './CreateProduct';
import type { Product } from '../services/api';

interface ProductsListProps {
  token?: string;
}

export default function ProductsList({ token }: ProductsListProps) {
  const { data: products, loading, error, refetch } = useProducts(token);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: '',
    });
  };

  const handleProductCreated = () => {
    // Refresh the products list
    refetch();
  };

  if (loading) {
    return <div className="products-list loading">Loading products...</div>;
  }

  if (error) {
    return <div className="products-list error">Error: {error}</div>;
  }

  return (
    <div className="products-list">
      <h3>Products</h3>
      
      {/* Create Product Form */}
      {token && (
        <CreateProduct token={token} onProductCreated={handleProductCreated} />
      )}
      
      {/* Filters */}
      <div className="filters">
        <h4>Filters</h4>
        <div className="filter-row">
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            />
          </label>
          
          <label>
            Min Price:
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </label>
          
          <label>
            Max Price:
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </label>
          
          <label>
            In Stock:
            <select name="inStock" value={filters.inStock} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
          
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>
      
      {/* Products */}
      {products && products.length > 0 ? (
        <div className="products-grid">
          {products.map((product: Product) => (
            <div key={product.id} className="product-card">
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Category: {product.category}</p>
              <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}