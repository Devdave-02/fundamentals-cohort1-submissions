const productService = require('../../src/services/productService');

describe('Product Service - Unit Tests', () => {
  beforeEach(() => {
    // Reset products to initial state
    // In production, you'd reset the database
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products', () => {
      const products = productService.getAllProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });

    it('should filter by category', () => {
      const products = productService.getAllProducts({ category: 'Electronics' });
      products.forEach(product => {
        expect(product.category).toBe('Electronics');
      });
    });

    it('should filter by minPrice', () => {
      const products = productService.getAllProducts({ minPrice: '50' });
      products.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(50);
      });
    });

    it('should filter by maxPrice', () => {
      const products = productService.getAllProducts({ maxPrice: '100' });
      products.forEach(product => {
        expect(product.price).toBeLessThanOrEqual(100);
      });
    });

    it('should combine multiple filters', () => {
      const products = productService.getAllProducts({
        category: 'Electronics',
        minPrice: '50',
        maxPrice: '100'
      });
      products.forEach(product => {
        expect(product.category).toBe('Electronics');
        expect(product.price).toBeGreaterThanOrEqual(50);
        expect(product.price).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('getProductById', () => {
    it('should return product by id', () => {
      const product = productService.getProductById(1);
      expect(product).toBeDefined();
      expect(product.id).toBe(1);
    });

    it('should return undefined for non-existent product', () => {
      const product = productService.getProductById(999);
      expect(product).toBeUndefined();
    });
  });

  describe('createProduct', () => {
    it('should create a new product', () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        stock: 5,
        category: 'Test'
      };

      const product = productService.createProduct(productData);

      expect(product).toBeDefined();
      expect(product.name).toBe(productData.name);
      expect(product.price).toBe(productData.price);
      expect(product.stock).toBe(productData.stock);
      expect(product.category).toBe(productData.category);
      expect(product.id).toBeDefined();
    });

    it('should default stock to 0 if not provided', () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        category: 'Test'
      };

      const product = productService.createProduct(productData);
      expect(product.stock).toBe(0);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', () => {
      const product = productService.createProduct({
        name: 'Test Product',
        price: 99.99,
        stock: 5,
        category: 'Test'
      });

      const updated = productService.updateProduct(product.id, {
        name: 'Updated Product',
        price: 149.99
      });

      expect(updated.name).toBe('Updated Product');
      expect(updated.price).toBe(149.99);
      expect(updated.id).toBe(product.id);
    });

    it('should throw error for non-existent product', () => {
      expect(() => {
        productService.updateProduct(999, { name: 'Updated' });
      }).toThrow('Product not found');
    });
  });

  describe('deleteProduct', () => {
    it('should delete an existing product', () => {
      const product = productService.createProduct({
        name: 'Test Product',
        price: 99.99,
        stock: 5,
        category: 'Test'
      });

      const result = productService.deleteProduct(product.id);
      expect(result).toBe(true);

      const deleted = productService.getProductById(product.id);
      expect(deleted).toBeUndefined();
    });

    it('should throw error for non-existent product', () => {
      expect(() => {
        productService.deleteProduct(999);
      }).toThrow('Product not found');
    });
  });

  describe('updateStock', () => {
    it('should increase stock', () => {
      const product = productService.getProductById(1);
      const initialStock = product.stock;
      const updated = productService.updateStock(1, 5);

      expect(updated.stock).toBe(initialStock + 5);
    });

    it('should decrease stock', () => {
      const product = productService.getProductById(1);
      const initialStock = product.stock;
      const updated = productService.updateStock(1, -2);

      expect(updated.stock).toBe(initialStock - 2);
    });

    it('should throw error for insufficient stock', () => {
      const product = productService.getProductById(1);
      const stockToDecrease = product.stock + 10;

      expect(() => {
        productService.updateStock(1, -stockToDecrease);
      }).toThrow('Insufficient stock');
    });

    it('should throw error for non-existent product', () => {
      expect(() => {
        productService.updateStock(999, 5);
      }).toThrow('Product not found');
    });
  });
});
