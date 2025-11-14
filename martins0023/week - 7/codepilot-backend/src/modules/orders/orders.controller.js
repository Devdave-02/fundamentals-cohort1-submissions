const orderService = require('./orders.service');

const placeOrder = async (req, res) => {
  try {
    // The userId comes from our `checkAuth` middleware, not the request body
    // This is much more secure!
    const userId = req.userData.userId;
    const { items } = req.body; // e.g., [{ productId: 1, quantity: 2 }]

    const newOrder = await orderService.createOrder(userId, items);
    res.status(201).json(newOrder); // 201 Created
  } catch (error) {
    if (error.message.includes('Invalid') || error.message.includes('not found')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating order' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const orders = await orderService.getOrdersForUser(userId);
    res.status(200).json(orders);
  } catch (error) {
    if (error.message.includes('required')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
};