const orderService = require('../../src/modules/orders/orders.service');
const productService = require('../../src/modules/products/products.service');

// We need to mock the productService to control its output
jest.mock('../../src/modules/products/products.service.js', () => ({
  getProductById: jest.fn(),
}));

describe('Orders Service (Unit Tests)', () => {
  
  beforeEach(() => {
    orderService.__cleanupMockDb();
    productService.__cleanupMockDb; // (Does not exist on mock, just reset fn)
    jest.clearAllMocks();
    
    // Setup mock product data for
    productService.getProductById.mockImplementation(async (id) => {
      if (id === 1) {
        return { id: 1, name: 'CodePilot Pro', price: 99.99 };
      }
      if (id === 2) {
        return { id: 2, name: 'CodePilot Lite', price: 49.99 };
      }
      return null;
    });
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const userId = 1;
      const items = [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 },
      ];

      const order = await orderService.createOrder(userId, items);

      expect(order).toBeDefined();
      expect(order.id).toBe(1);
      expect(order.userId).toBe(userId);
      expect(order.items.length).toBe(2);
      expect(order.items[0].name).toBe('CodePilot Pro');
      expect(order.total).toBe(99.99 + (49.99 * 2));
    });

    it('should throw error for invalid items data', async () => {
      await expect(orderService.createOrder(1, null))
        .rejects.toThrow('Invalid order data');
      await expect(orderService.createOrder(1, []))
        .rejects.toThrow('Invalid order data');
    });

    it('should throw error if a product is not found', async () => {
      const items = [{ productId: 999, quantity: 1 }];
      await expect(orderService.createOrder(1, items))
        .rejects.toThrow('Product with ID 999 not found');
    });

    it('should throw error for invalid quantity', async () => {
      const items = [{ productId: 1, quantity: 0 }];
      await expect(orderService.createOrder(1, items))
        .rejects.toThrow('Invalid quantity for product ID 1');
    });
  });

  describe('getOrdersForUser', () => {
    it('should return all orders for a specific user', async () => {
      // Create a few orders
      await orderService.createOrder(1, [{ productId: 1, quantity: 1 }]);
      await orderService.createOrder(2, [{ productId: 2, quantity: 1 }]);
      await orderService.createOrder(1, [{ productId: 2, quantity: 2 }]);

      const user1Orders = await orderService.getOrdersForUser(1);
      const user2Orders = await orderService.getOrdersForUser(2);

      expect(user1Orders).toHaveLength(2);
      expect(user2Orders).toHaveLength(1);
      expect(user1Orders[0].id).toBe(1);
      expect(user1Orders[1].id).toBe(3);
      expect(user2Orders[0].id).toBe(2);
    });

    it('should return an empty array for a user with no orders', async () => {
      const orders = await orderService.getOrdersForUser(999);
      expect(orders).toHaveLength(0);
    });
  });
});