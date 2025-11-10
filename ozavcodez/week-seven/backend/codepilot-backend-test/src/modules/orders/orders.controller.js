const ordersService = require('./orders.service');
const asyncHandler = require('../../middleware/asyncHandler');

/**
 * Create a new order
 * POST /api/orders
 */
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;
  const userId = req.user.userId;

  const order = ordersService.createOrder(userId, items, shippingAddress);

  res.status(201).json({
    success: true,
    data: order
  });
});

/**
 * Get all orders (admin) or user's orders
 * GET /api/orders
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const filters = {
    userId: req.query.userId || req.user.userId,
    status: req.query.status
  };

  const orders = ordersService.getAllOrders(filters);

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

/**
 * Get order by ID
 * GET /api/orders/:id
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = ordersService.getOrderById(req.params.id);

  // Check if user owns the order
  if (order.userId !== req.user.userId) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized to view this order'
    });
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

/**
 * Update order status
 * PATCH /api/orders/:id/status
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = ordersService.updateOrderStatus(req.params.id, status);

  res.status(200).json({
    success: true,
    data: order
  });
});

/**
 * Cancel order
 * POST /api/orders/:id/cancel
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const order = ordersService.cancelOrder(req.params.id, userId);

  res.status(200).json({
    success: true,
    data: order
  });
});

/**
 * Get order statistics
 * GET /api/orders/stats
 */
const getOrderStats = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const stats = ordersService.getOrderStats(userId);

  res.status(200).json({
    success: true,
    data: stats
  });
});

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
};
