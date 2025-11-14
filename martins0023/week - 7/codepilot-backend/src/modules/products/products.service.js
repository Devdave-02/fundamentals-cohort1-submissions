// --- Mock Database ---
const MOCK_DB = {
  products: [
    { id: 1, name: 'CodePilot Pro', sku: 'CP-PRO-01', price: 99.99 },
    { id: 2, name: 'CodePilot Lite', sku: 'CP-LITE-01', price: 49.99 },
    { id: 3, name: 'TestMaster 3000', sku: 'TM-3000-01', price: 149.99 },
  ],
};
// --- ---

const getAllProducts = async () => {
  // In a real app, this would be an async DB call
  return MOCK_DB.products;
};

const getProductById = async (id) => {
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    throw new Error('Invalid product ID');
  }

  const product = MOCK_DB.products.find((p) => p.id === productId);
  if (!product) {
    return null; // Not found
  }
  return product;
};

// Helper for tests
const __cleanupMockDb = () => {
  MOCK_DB.products = [
    { id: 1, name: 'CodePilot Pro', sku: 'CP-PRO-01', price: 99.99 },
    { id: 2, name: 'CodePilot Lite', sku: 'CP-LITE-01', price: 49.99 },
    { id: 3, name: 'TestMaster 3000', sku: 'TM-3000-01', price: 149.99 },
  ];
};

module.exports = {
  getAllProducts,
  getProductById,
  __cleanupMockDb,
};