const productService = require('./productService');

// In-memory order store (replace with database in production)
const orders = [];
let nextOrderId = 1;

const createOrder = (userId, items) => {
  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = productService.getProductById(item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}`);
    }

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    orderItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      price: product.price,
      subtotal: itemTotal
    });

    // Update stock
    productService.updateStock(product.id, -item.quantity);
  }

  const newOrder = {
    id: nextOrderId++,
    userId,
    items: orderItems,
    total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  return newOrder;
};

const getAllOrders = (userId = null) => {
  if (userId) {
    return orders.filter(o => o.userId === parseInt(userId));
  }
  return [...orders];
};

const getOrderById = (id, userId = null) => {
  const order = orders.find(o => o.id === parseInt(id));
  
  if (!order) {
    throw new Error('Order not found');
  }

  if (userId && order.userId !== parseInt(userId)) {
    throw new Error('Unauthorized to view this order');
  }

  return order;
};

const updateOrderStatus = (id, status) => {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid order status');
  }

  const order = getOrderById(id);
  order.status = status;
  order.updatedAt = new Date().toISOString();

  return order;
};

const cancelOrder = (id, userId) => {
  const order = getOrderById(id, userId);
  
  if (order.status === 'delivered') {
    throw new Error('Cannot cancel a delivered order');
  }

  // Restore stock
  for (const item of order.items) {
    productService.updateStock(item.productId, item.quantity);
  }

  order.status = 'cancelled';
  order.updatedAt = new Date().toISOString();

  return order;
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
