// We need to access product data to validate orders
const productService = require('../products/products.service');

// --- Mock Database ---
const MOCK_DB = {
  orders: [],
};
// --- ---

const createOrder = async (userId, items) => {
  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Invalid order data');
  }

  let totalAmount = 0;
  const orderItems = [];

  // Validate items and calculate total
  for (const item of items) {
    const product = await productService.getProductById(item.productId);
    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }
    if (item.quantity <= 0) {
      throw new Error(`Invalid quantity for product ID ${item.productId}`);
    }

    orderItems.push({
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
    });
    totalAmount += product.price * item.quantity;
  }

  // Create the order
  const newOrder = {
    id: MOCK_DB.orders.length + 1,
    userId: userId,
    createdAt: new Date().toISOString(),
    items: orderItems,
    total: parseFloat(totalAmount.toFixed(2)), // Fix floating point issues
  };

  MOCK_DB.orders.push(newOrder);
  return newOrder;
};

const getOrdersForUser = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const userOrders = MOCK_DB.orders.filter((order) => order.userId === userId);
  return userOrders;
};

// Helper for tests
const __cleanupMockDb = () => {
  MOCK_DB.orders = [];
};

module.exports = {
  createOrder,
  getOrdersForUser,
  __cleanupMockDb,
};