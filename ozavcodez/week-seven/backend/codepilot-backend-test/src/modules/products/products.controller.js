const productsService = require('./products.service');
const asyncHandler = require('../../middleware/asyncHandler');

/**
 * Create a new product
 * POST /api/products
 */
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const product = productsService.createProduct(name, description, price, stock, category);

  res.status(201).json({
    success: true,
    data: product
  });
});

/**
 * Get all products
 * GET /api/products
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const filters = {
    category: req.query.category,
    minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
    inStock: req.query.inStock
  };

  const products = productsService.getAllProducts(filters);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

/**
 * Get product by ID
 * GET /api/products/:id
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = productsService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * Update product
 * PUT /api/products/:id
 */
const updateProduct = asyncHandler(async (req, res) => {
  const updates = req.body;
  const product = productsService.updateProduct(req.params.id, updates);

  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * Delete product
 * DELETE /api/products/:id
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = productsService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    data: product
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
