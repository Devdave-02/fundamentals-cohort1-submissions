const { v4: uuidv4 } = require('uuid');
const { ValidationError, NotFoundError } = require('../../utils/errors');
const productsService = require('../products/products.service');

// In-memory order store
const orders = new Map();

const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

class OrdersService {
  /**
   * Validate order items
   */
  validateOrderItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Order must contain at least one item');
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        throw new ValidationError('Each item must have a valid productId and quantity');
      }

      // Check if product exists and has sufficient stock
      const product = productsService.getProductById(item.productId);
      if (!productsService.isAvailable(item.productId, item.quantity)) {
        throw new ValidationError(`Insufficient stock for product: ${product.name}`);
      }
    }
  }

  /**
   * Calculate order total
   */
  calculateTotal(items) {
    return items.reduce((total, item) => {
      const product = productsService.getProductById(item.productId);
      return total + (product.price * item.quantity);
    }, 0);
  }

  /**
   * Create a new order
   */
  createOrder(userId, items, shippingAddress) {
    // Validate inputs
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      throw new ValidationError('Valid shipping address is required');
    }

    this.validateOrderItems(items);

    // Calculate total
    const total = this.calculateTotal(items);

    // Create order
    const order = {
      id: uuidv4(),
      userId,
      items: items.map(item => {
        const product = productsService.getProductById(item.productId);
        return {
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
          subtotal: product.price * item.quantity
        };
      }),
      total,
      status: ORDER_STATUS.PENDING,
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update product stock
    for (const item of items) {
      productsService.updateStock(item.productId, -item.quantity);
    }

    orders.set(order.id, order);
    return order;
  }

  /**
   * Get all orders with optional filtering
   */
  getAllOrders(filters = {}) {
    let orderList = Array.from(orders.values());

    // Filter by user
    if (filters.userId) {
      orderList = orderList.filter(o => o.userId === filters.userId);
    }

    // Filter by status
    if (filters.status) {
      orderList = orderList.filter(o => o.status === filters.status);
    }

    return orderList;
  }

  /**
   * Get order by ID
   */
  getOrderById(orderId) {
    const order = orders.get(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  /**
   * Get orders by user ID
   */
  getOrdersByUserId(userId) {
    return Array.from(orders.values()).filter(o => o.userId === userId);
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId, status) {
    const order = this.getOrderById(orderId);

    // Validate status
    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new ValidationError('Invalid order status');
    }

    // Prevent updating cancelled orders
    if (order.status === ORDER_STATUS.CANCELLED) {
      throw new ValidationError('Cannot update cancelled order');
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    orders.set(orderId, order);

    return order;
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId, userId) {
    const order = this.getOrderById(orderId);

    // Check if user owns the order
    if (order.userId !== userId) {
      throw new ValidationError('Unauthorized to cancel this order');
    }

    // Only pending or processing orders can be cancelled
    if (![ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING].includes(order.status)) {
      throw new ValidationError('Order cannot be cancelled at this stage');
    }

    // Restore product stock
    for (const item of order.items) {
      productsService.updateStock(item.productId, item.quantity);
    }

    order.status = ORDER_STATUS.CANCELLED;
    order.updatedAt = new Date().toISOString();
    orders.set(orderId, order);

    return order;
  }

  /**
   * Get order statistics
   */
  getOrderStats(userId = null) {
    let orderList = Array.from(orders.values());

    if (userId) {
      orderList = orderList.filter(o => o.userId === userId);
    }

    return {
      total: orderList.length,
      pending: orderList.filter(o => o.status === ORDER_STATUS.PENDING).length,
      processing: orderList.filter(o => o.status === ORDER_STATUS.PROCESSING).length,
      shipped: orderList.filter(o => o.status === ORDER_STATUS.SHIPPED).length,
      delivered: orderList.filter(o => o.status === ORDER_STATUS.DELIVERED).length,
      cancelled: orderList.filter(o => o.status === ORDER_STATUS.CANCELLED).length,
      totalRevenue: orderList
        .filter(o => o.status !== ORDER_STATUS.CANCELLED)
        .reduce((sum, o) => sum + o.total, 0)
    };
  }

  /**
   * Clear all orders (for testing)
   */
  clearOrders() {
    orders.clear();
  }
}

module.exports = new OrdersService();
module.exports.ORDER_STATUS = ORDER_STATUS;
