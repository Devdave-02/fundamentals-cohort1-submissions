const { v4: uuidv4 } = require('uuid');
const { ValidationError, NotFoundError } = require('../../utils/errors');

// In-memory product store
const products = new Map();

class ProductsService {
  /**
   * Validate product data
   */
  validateProduct(name, price, stock) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new ValidationError('Product name is required');
    }

    if (price === undefined || price === null || typeof price !== 'number' || price < 0) {
      throw new ValidationError('Valid price is required');
    }

    if (stock === undefined || stock === null || typeof stock !== 'number' || stock < 0) {
      throw new ValidationError('Valid stock quantity is required');
    }
  }

  /**
   * Create a new product
   */
  createProduct(name, description, price, stock, category) {
    this.validateProduct(name, price, stock);

    const product = {
      id: uuidv4(),
      name: name.trim(),
      description: description || '',
      price,
      stock,
      category: category || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.set(product.id, product);
    return product;
  }

  /**
   * Get all products with optional filtering
   */
  getAllProducts(filters = {}) {
    let productList = Array.from(products.values());

    // Filter by category
    if (filters.category) {
      productList = productList.filter(p => p.category === filters.category);
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      productList = productList.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      productList = productList.filter(p => p.price <= filters.maxPrice);
    }

    // Filter by availability
    if (filters.inStock === 'true') {
      productList = productList.filter(p => p.stock > 0);
    }

    return productList;
  }

  /**
   * Get product by ID
   */
  getProductById(productId) {
    const product = products.get(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  /**
   * Update product
   */
  updateProduct(productId, updates) {
    const product = this.getProductById(productId);

    // Validate updates if provided
    const name = updates.name !== undefined ? updates.name : product.name;
    const price = updates.price !== undefined ? updates.price : product.price;
    const stock = updates.stock !== undefined ? updates.stock : product.stock;

    this.validateProduct(name, price, stock);

    const updatedProduct = {
      ...product,
      name: name.trim(),
      description: updates.description !== undefined ? updates.description : product.description,
      price,
      stock,
      category: updates.category !== undefined ? updates.category : product.category,
      updatedAt: new Date().toISOString()
    };

    products.set(productId, updatedProduct);
    return updatedProduct;
  }

  /**
   * Delete product
   */
  deleteProduct(productId) {
    const product = this.getProductById(productId);
    products.delete(productId);
    return product;
  }

  /**
   * Update product stock
   */
  updateStock(productId, quantity) {
    const product = this.getProductById(productId);

    if (typeof quantity !== 'number') {
      throw new ValidationError('Quantity must be a number');
    }

    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new ValidationError('Insufficient stock');
    }

    product.stock = newStock;
    product.updatedAt = new Date().toISOString();
    products.set(productId, product);

    return product;
  }

  /**
   * Check if product is available
   */
  isAvailable(productId, quantity = 1) {
    const product = this.getProductById(productId);
    return product.stock >= quantity;
  }

  /**
   * Clear all products (for testing)
   */
  clearProducts() {
    products.clear();
  }
}

module.exports = new ProductsService();
