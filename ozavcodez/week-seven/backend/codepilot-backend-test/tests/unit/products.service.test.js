const productsService = require('../../src/modules/products/products.service');
const { ValidationError, NotFoundError } = require('../../src/utils/errors');

describe('Products Service - Unit Tests', () => {
  beforeEach(() => {
    productsService.clearProducts();
  });

  describe('validateProduct', () => {
    it('should not throw error for valid product data', () => {
      expect(() => productsService.validateProduct('Test Product', 99.99, 10)).not.toThrow();
    });

    it('should throw ValidationError for missing name', () => {
      expect(() => productsService.validateProduct('', 99.99, 10)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid price', () => {
      expect(() => productsService.validateProduct('Test Product', -1, 10)).toThrow(ValidationError);
      expect(() => productsService.validateProduct('Test Product', 'invalid', 10)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid stock', () => {
      expect(() => productsService.validateProduct('Test Product', 99.99, -1)).toThrow(ValidationError);
      expect(() => productsService.validateProduct('Test Product', 99.99, 'invalid')).toThrow(ValidationError);
    });
  });

  describe('createProduct', () => {
    it('should create a product successfully', () => {
      const product = productsService.createProduct('Laptop', 'High-end laptop', 1299.99, 5, 'electronics');

      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe('Laptop');
      expect(product.description).toBe('High-end laptop');
      expect(product.price).toBe(1299.99);
      expect(product.stock).toBe(5);
      expect(product.category).toBe('electronics');
      expect(product.createdAt).toBeDefined();
      expect(product.updatedAt).toBeDefined();
    });

    it('should create product with default category', () => {
      const product = productsService.createProduct('Test Product', '', 99.99, 10);

      expect(product.category).toBe('general');
    });

    it('should trim product name', () => {
      const product = productsService.createProduct('  Laptop  ', '', 1299.99, 5);

      expect(product.name).toBe('Laptop');
    });

    it('should throw ValidationError for invalid data', () => {
      expect(() => productsService.createProduct('', '', 99.99, 10)).toThrow(ValidationError);
      expect(() => productsService.createProduct('Product', '', -1, 10)).toThrow(ValidationError);
    });
  });

  describe('getAllProducts', () => {
    beforeEach(() => {
      productsService.createProduct('Laptop', 'High-end laptop', 1299.99, 5, 'electronics');
      productsService.createProduct('Mouse', 'Wireless mouse', 29.99, 0, 'electronics');
      productsService.createProduct('Desk', 'Standing desk', 499.99, 3, 'furniture');
    });

    it('should return all products', () => {
      const products = productsService.getAllProducts();

      expect(products).toHaveLength(3);
    });

    it('should filter by category', () => {
      const products = productsService.getAllProducts({ category: 'electronics' });

      expect(products).toHaveLength(2);
      expect(products.every(p => p.category === 'electronics')).toBe(true);
    });

    it('should filter by minimum price', () => {
      const products = productsService.getAllProducts({ minPrice: 100 });

      expect(products).toHaveLength(2);
      expect(products.every(p => p.price >= 100)).toBe(true);
    });

    it('should filter by maximum price', () => {
      const products = productsService.getAllProducts({ maxPrice: 500 });

      expect(products).toHaveLength(2);
      expect(products.every(p => p.price <= 500)).toBe(true);
    });

    it('should filter by stock availability', () => {
      const products = productsService.getAllProducts({ inStock: 'true' });

      expect(products).toHaveLength(2);
      expect(products.every(p => p.stock > 0)).toBe(true);
    });

    it('should apply multiple filters', () => {
      const products = productsService.getAllProducts({
        category: 'electronics',
        minPrice: 50,
        inStock: 'true'
      });

      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Laptop');
    });
  });

  describe('getProductById', () => {
    it('should return product by ID', () => {
      const created = productsService.createProduct('Laptop', '', 1299.99, 5);
      const product = productsService.getProductById(created.id);

      expect(product).toBeDefined();
      expect(product.id).toBe(created.id);
      expect(product.name).toBe('Laptop');
    });

    it('should throw NotFoundError for non-existent product', () => {
      expect(() => productsService.getProductById('nonexistent')).toThrow(NotFoundError);
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', () => {
      const created = productsService.createProduct('Laptop', 'Old description', 1299.99, 5);
      const updated = productsService.updateProduct(created.id, {
        name: 'Gaming Laptop',
        description: 'New description',
        price: 1499.99,
        stock: 10
      });

      expect(updated.name).toBe('Gaming Laptop');
      expect(updated.description).toBe('New description');
      expect(updated.price).toBe(1499.99);
      expect(updated.stock).toBe(10);
      expect(updated.updatedAt).toBeDefined();
      expect(updated.id).toBe(created.id);
    });

    it('should update only provided fields', () => {
      const created = productsService.createProduct('Laptop', 'Description', 1299.99, 5);
      const updated = productsService.updateProduct(created.id, { price: 999.99 });

      expect(updated.name).toBe('Laptop');
      expect(updated.description).toBe('Description');
      expect(updated.price).toBe(999.99);
      expect(updated.stock).toBe(5);
    });

    it('should throw NotFoundError for non-existent product', () => {
      expect(() => productsService.updateProduct('nonexistent', { price: 99.99 })).toThrow(NotFoundError);
    });

    it('should throw ValidationError for invalid updates', () => {
      const created = productsService.createProduct('Laptop', '', 1299.99, 5);
      expect(() => productsService.updateProduct(created.id, { price: -1 })).toThrow(ValidationError);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', () => {
      const created = productsService.createProduct('Laptop', '', 1299.99, 5);
      const deleted = productsService.deleteProduct(created.id);

      expect(deleted.id).toBe(created.id);
      expect(() => productsService.getProductById(created.id)).toThrow(NotFoundError);
    });

    it('should throw NotFoundError for non-existent product', () => {
      expect(() => productsService.deleteProduct('nonexistent')).toThrow(NotFoundError);
    });
  });

  describe('updateStock', () => {
    it('should increase stock', () => {
      const created = productsService.createProduct('Laptop', '', 1299.99, 5);
      const updated = productsService.updateStock(created.id, 10);

      expect(updated.stock).toBe(15);
    });

    it('should decrease stock', () => {
      const created = productsService.createProduct('Laptop', '', 1299.99, 5);
      const updated = productsService.updateStock(created.id, -3);

      expect(updated.stock).toBe(2);
    });

    it('should throw ValidationError for insufficient stock', () => {
      const created = productsService.createProduct('Laptop', '', 1299.99, 5);
      expect(() => productsService.updateStock(created.id, -10)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid quantity', () => {
      const created = productsService.createProduct('Laptop', '', 1299.99, 5);
      expect(() => productsService.updateStock(created.id, 'invalid')).toThrow(ValidationError);
    });
  });

  describe('isAvailable', () => {
    it('should return true when product has sufficient stock', () => {
      const created = productsService.createProduct('Laptop', '', 1299.99, 5);
      expect(productsService.isAvailable(created.id, 3)).toBe(true);
    });

    it('should return false when product has insufficient stock', () => {
      const created = productsService.createProduct('Laptop', '', 1299.99, 5);
      expect(productsService.isAvailable(created.id, 10)).toBe(false);
    });

    it('should check for quantity 1 by default', () => {
      const created = productsService.createProduct('Laptop', '', 1299.99, 5);
      expect(productsService.isAvailable(created.id)).toBe(true);
    });
  });
});
