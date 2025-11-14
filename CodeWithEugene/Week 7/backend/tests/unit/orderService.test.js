const orderService = require('../../src/services/orderService');
const productService = require('../../src/services/productService');

describe('Order Service - Unit Tests', () => {
  beforeEach(() => {
    // Reset state - in production, you'd reset the database
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order with valid items', () => {
      const userId = 1;
      const items = [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 }
      ];

      const order = orderService.createOrder(userId, items);

      expect(order).toBeDefined();
      expect(order.userId).toBe(userId);
      expect(order.items).toHaveLength(2);
      expect(order.status).toBe('pending');
      expect(order.total).toBeGreaterThan(0);
      expect(order.id).toBeDefined();
    });

    it('should calculate correct total', () => {
      const product1 = productService.getProductById(1);
      const product2 = productService.getProductById(2);
      const expectedTotal = (product1.price * 2) + (product2.price * 1);

      const order = orderService.createOrder(1, [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 }
      ]);

      expect(order.total).toBe(expectedTotal);
    });

    it('should update product stock', () => {
      const product = productService.getProductById(1);
      const initialStock = product.stock;

      orderService.createOrder(1, [{ productId: 1, quantity: 2 }]);

      const updatedProduct = productService.getProductById(1);
      expect(updatedProduct.stock).toBe(initialStock - 2);
    });

    it('should throw error for empty items', () => {
      expect(() => {
        orderService.createOrder(1, []);
      }).toThrow('Order must contain at least one item');
    });

    it('should throw error for non-existent product', () => {
      expect(() => {
        orderService.createOrder(1, [{ productId: 999, quantity: 1 }]);
      }).toThrow('Product 999 not found');
    });

    it('should throw error for insufficient stock', () => {
      const product = productService.getProductById(1);
      const quantity = product.stock + 10;

      expect(() => {
        orderService.createOrder(1, [{ productId: 1, quantity }]);
      }).toThrow('Insufficient stock');
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders when no userId provided', () => {
      orderService.createOrder(1, [{ productId: 1, quantity: 1 }]);
      orderService.createOrder(2, [{ productId: 2, quantity: 1 }]);

      const orders = orderService.getAllOrders();
      expect(orders.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter orders by userId', () => {
      orderService.createOrder(1, [{ productId: 1, quantity: 1 }]);
      orderService.createOrder(2, [{ productId: 2, quantity: 1 }]);
      orderService.createOrder(1, [{ productId: 3, quantity: 1 }]);

      const userOrders = orderService.getAllOrders(1);
      userOrders.forEach(order => {
        expect(order.userId).toBe(1);
      });
    });
  });

  describe('getOrderById', () => {
    it('should return order by id', () => {
      const order = orderService.createOrder(1, [{ productId: 1, quantity: 1 }]);
      const found = orderService.getOrderById(order.id);

      expect(found).toBeDefined();
      expect(found.id).toBe(order.id);
    });

    it('should throw error for non-existent order', () => {
      expect(() => {
        orderService.getOrderById(999);
      }).toThrow('Order not found');
    });

    it('should authorize user access', () => {
      const order = orderService.createOrder(1, [{ productId: 1, quantity: 1 }]);

      expect(() => {
        orderService.getOrderById(order.id, 2);
      }).toThrow('Unauthorized to view this order');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', () => {
      const order = orderService.createOrder(1, [{ productId: 1, quantity: 1 }]);
      const updated = orderService.updateOrderStatus(order.id, 'shipped');

      expect(updated.status).toBe('shipped');
    });

    it('should throw error for invalid status', () => {
      const order = orderService.createOrder(1, [{ productId: 1, quantity: 1 }]);

      expect(() => {
        orderService.updateOrderStatus(order.id, 'invalid-status');
      }).toThrow('Invalid order status');
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order and restore stock', () => {
      const product = productService.getProductById(1);
      const initialStock = product.stock;

      const order = orderService.createOrder(1, [{ productId: 1, quantity: 2 }]);
      const cancelled = orderService.cancelOrder(order.id, 1);

      expect(cancelled.status).toBe('cancelled');
      
      const restoredProduct = productService.getProductById(1);
      expect(restoredProduct.stock).toBe(initialStock);
    });

    it('should throw error when cancelling delivered order', () => {
      const order = orderService.createOrder(1, [{ productId: 1, quantity: 1 }]);
      orderService.updateOrderStatus(order.id, 'delivered');

      expect(() => {
        orderService.cancelOrder(order.id, 1);
      }).toThrow('Cannot cancel a delivered order');
    });
  });
});
