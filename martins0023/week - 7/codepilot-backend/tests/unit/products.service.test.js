const productService = require('../../src/modules/products/products.service');

// Test suite for the Product Service
describe('Product Service (Unit Tests)', () => {
  // Reset mock DB before each test
  beforeEach(() => {
    productService.__cleanupMockDb();
  });

  // Test case for getAllProducts
  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = await productService.getAllProducts();
      expect(products).toBeInstanceOf(Array);
      expect(products.length).toBe(3); // Based on our mock data
      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('name');
    });
  });

  // Test case for getProductById
  describe('getProductById', () => {
    it('should return a single product for a valid ID', async () => {
      const product = await productService.getProductById(1);
      expect(product).toBeDefined();
      expect(product.id).toBe(1);
      expect(product.name).toBe('CodePilot Pro');
    });

    it('should return null for a non-existent ID', async () => {
      const product = await productService.getProductById(999);
      expect(product).toBeNull();
    });

    it('should throw an error for an invalid ID (string)', async () => {
      // We must wrap the async call in a function for expect.toThrow
      await expect(productService.getProductById('abc'))
        .rejects
        .toThrow('Invalid product ID');
    });

    it('should throw an error for an invalid ID (NaN)', async () => {
      await expect(productService.getProductById(NaN))
        .rejects
        .toThrow('Invalid product ID');
    });
  });
});