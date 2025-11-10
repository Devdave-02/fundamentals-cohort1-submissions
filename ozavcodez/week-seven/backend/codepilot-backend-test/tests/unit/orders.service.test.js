const ordersService = require('../../src/modules/orders/orders.service');
const productsService = require('../../src/modules/products/products.service');
const { ValidationError, NotFoundError } = require('../../src/utils/errors');
const { ORDER_STATUS } = require('../../src/modules/orders/orders.service');

describe('Orders Service - Unit Tests', () => {
  let product1, product2;

  beforeEach(() => {
    ordersService.clearOrders();
    productsService.clearProducts();

    // Create test products
    product1 = productsService.createProduct('Laptop', 'High-end laptop', 1299.99, 10, 'electronics');
    product2 = productsService.createProduct('Mouse', 'Wireless mouse', 29.99, 20, 'electronics');
  });

  describe('validateOrderItems', () => {
    it('should not throw error for valid items', () => {
      const items = [
        { productId: product1.id, quantity: 2 },
        { productId: product2.id, quantity: 1 }
      ];

      expect(() => ordersService.validateOrderItems(items)).not.toThrow();
    });

    it('should throw ValidationError for empty items array', () => {
      expect(() => ordersService.validateOrderItems([])).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid item structure', () => {
      const items = [{ productId: product1.id }]; // Missing quantity
      expect(() => ordersService.validateOrderItems(items)).toThrow(ValidationError);
    });

    it('should throw ValidationError for insufficient stock', () => {
      const items = [{ productId: product1.id, quantity: 100 }];
      expect(() => ordersService.validateOrderItems(items)).toThrow(ValidationError);
    });

    it('should throw NotFoundError for non-existent product', () => {
      const items = [{ productId: 'nonexistent', quantity: 1 }];
      expect(() => ordersService.validateOrderItems(items)).toThrow(NotFoundError);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total correctly', () => {
      const items = [
        { productId: product1.id, quantity: 2 },
        { productId: product2.id, quantity: 3 }
      ];

      const total = ordersService.calculateTotal(items);
      expect(total).toBe(2599.98 + 89.97); // (1299.99 * 2) + (29.99 * 3)
    });

    it('should return 0 for empty items', () => {
      const total = ordersService.calculateTotal([]);
      expect(total).toBe(0);
    });
  });

  describe('createOrder', () => {
    const shippingAddress = {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    };

    it('should create order successfully', () => {
      const items = [
        { productId: product1.id, quantity: 2 },
        { productId: product2.id, quantity: 1 }
      ];

      const order = ordersService.createOrder('user123', items, shippingAddress);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.userId).toBe('user123');
      expect(order.items).toHaveLength(2);
      expect(order.total).toBe(2629.97); // (1299.99 * 2) + (29.99 * 1)
      expect(order.status).toBe(ORDER_STATUS.PENDING);
      expect(order.shippingAddress).toEqual(shippingAddress);
    });

    it('should update product stock after order creation', () => {
      const items = [{ productId: product1.id, quantity: 2 }];
      ordersService.createOrder('user123', items, shippingAddress);

      const product = productsService.getProductById(product1.id);
      expect(product.stock).toBe(8); // 10 - 2
    });

    it('should include product details in order items', () => {
      const items = [{ productId: product1.id, quantity: 2 }];
      const order = ordersService.createOrder('user123', items, shippingAddress);

      expect(order.items[0].productName).toBe('Laptop');
      expect(order.items[0].price).toBe(1299.99);
      expect(order.items[0].subtotal).toBe(2599.98);
    });

    it('should throw ValidationError for missing userId', () => {
      const items = [{ productId: product1.id, quantity: 1 }];
      expect(() => ordersService.createOrder('', items, shippingAddress)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid shipping address', () => {
      const items = [{ productId: product1.id, quantity: 1 }];
      expect(() => ordersService.createOrder('user123', items, {})).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid items', () => {
      expect(() => ordersService.createOrder('user123', [], shippingAddress)).toThrow(ValidationError);
    });
  });

  describe('getAllOrders', () => {
    const shippingAddress = {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    };

    beforeEach(() => {
      const items = [{ productId: product1.id, quantity: 1 }];
      ordersService.createOrder('user1', items, shippingAddress);
      ordersService.createOrder('user2', items, shippingAddress);
      ordersService.createOrder('user1', items, shippingAddress);
    });

    it('should return all orders', () => {
      const orders = ordersService.getAllOrders();
      expect(orders).toHaveLength(3);
    });

    it('should filter by userId', () => {
      const orders = ordersService.getAllOrders({ userId: 'user1' });
      expect(orders).toHaveLength(2);
      expect(orders.every(o => o.userId === 'user1')).toBe(true);
    });

    it('should filter by status', () => {
      const allOrders = ordersService.getAllOrders();
      ordersService.updateOrderStatus(allOrders[0].id, ORDER_STATUS.PROCESSING);

      const orders = ordersService.getAllOrders({ status: ORDER_STATUS.PROCESSING });
      expect(orders).toHaveLength(1);
      expect(orders[0].status).toBe(ORDER_STATUS.PROCESSING);
    });
  });

  describe('getOrderById', () => {
    it('should return order by ID', () => {
      const items = [{ productId: product1.id, quantity: 1 }];
      const shippingAddress = { street: '123 Main St', city: 'New York' };
      const created = ordersService.createOrder('user123', items, shippingAddress);

      const order = ordersService.getOrderById(created.id);
      expect(order).toBeDefined();
      expect(order.id).toBe(created.id);
    });

    it('should throw NotFoundError for non-existent order', () => {
      expect(() => ordersService.getOrderById('nonexistent')).toThrow(NotFoundError);
    });
  });

  describe('getOrdersByUserId', () => {
    it('should return all orders for a user', () => {
      const items = [{ productId: product1.id, quantity: 1 }];
      const shippingAddress = { street: '123 Main St', city: 'New York' };

      ordersService.createOrder('user1', items, shippingAddress);
      ordersService.createOrder('user1', items, shippingAddress);
      ordersService.createOrder('user2', items, shippingAddress);

      const orders = ordersService.getOrdersByUserId('user1');
      expect(orders).toHaveLength(2);
      expect(orders.every(o => o.userId === 'user1')).toBe(true);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', () => {
      const items = [{ productId: product1.id, quantity: 1 }];
      const shippingAddress = { street: '123 Main St', city: 'New York' };
      const order = ordersService.createOrder('user123', items, shippingAddress);

      const updated = ordersService.updateOrderStatus(order.id, ORDER_STATUS.PROCESSING);
      expect(updated.status).toBe(ORDER_STATUS.PROCESSING);
      expect(updated.updatedAt).toBeDefined();
      expect(updated.id).toBe(order.id);
    });

    it('should throw ValidationError for invalid status', () => {
      const items = [{ productId: product1.id, quantity: 1 }];
      const shippingAddress = { street: '123 Main St', city: 'New York' };
      const order = ordersService.createOrder('user123', items, shippingAddress);

      expect(() => ordersService.updateOrderStatus(order.id, 'invalid_status')).toThrow(ValidationError);
    });

    it('should throw ValidationError when updating cancelled order', () => {
      const items = [{ productId: product1.id, quantity: 1 }];
      const shippingAddress = { street: '123 Main St', city: 'New York' };
      const order = ordersService.createOrder('user123', items, shippingAddress);

      ordersService.cancelOrder(order.id, 'user123');
      expect(() => ordersService.updateOrderStatus(order.id, ORDER_STATUS.PROCESSING)).toThrow(ValidationError);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order successfully', () => {
      const items = [{ productId: product1.id, quantity: 2 }];
      const shippingAddress = { street: '123 Main St', city: 'New York' };
      const order = ordersService.createOrder('user123', items, shippingAddress);

      const cancelled = ordersService.cancelOrder(order.id, 'user123');
      expect(cancelled.status).toBe(ORDER_STATUS.CANCELLED);
    });

    it('should restore product stock after cancellation', () => {
      const items = [{ productId: product1.id, quantity: 2 }];
      const shippingAddress = { street: '123 Main St', city: 'New York' };
      const order = ordersService.createOrder('user123', items, shippingAddress);

      ordersService.cancelOrder(order.id, 'user123');

      const product = productsService.getProductById(product1.id);
      expect(product.stock).toBe(10); // Restored to original
    });

    it('should throw ValidationError when user does not own order', () => {
      const items = [{ productId: product1.id, quantity: 1 }];
      const shippingAddress = { street: '123 Main St', city: 'New York' };
      const order = ordersService.createOrder('user123', items, shippingAddress);

      expect(() => ordersService.cancelOrder(order.id, 'different_user')).toThrow(ValidationError);
    });

    it('should throw ValidationError when order is already shipped', () => {
      const items = [{ productId: product1.id, quantity: 1 }];
      const shippingAddress = { street: '123 Main St', city: 'New York' };
      const order = ordersService.createOrder('user123', items, shippingAddress);

      ordersService.updateOrderStatus(order.id, ORDER_STATUS.SHIPPED);
      expect(() => ordersService.cancelOrder(order.id, 'user123')).toThrow(ValidationError);
    });
  });

  describe('getOrderStats', () => {
    beforeEach(() => {
      const items = [{ productId: product1.id, quantity: 1 }];
      const shippingAddress = { street: '123 Main St', city: 'New York' };

      const order1 = ordersService.createOrder('user1', items, shippingAddress);
      const order2 = ordersService.createOrder('user1', items, shippingAddress);
      const order3 = ordersService.createOrder('user2', items, shippingAddress);

      ordersService.updateOrderStatus(order1.id, ORDER_STATUS.PROCESSING);
      ordersService.updateOrderStatus(order2.id, ORDER_STATUS.DELIVERED);
      ordersService.cancelOrder(order3.id, 'user2');
    });

    it('should return stats for all orders', () => {
      const stats = ordersService.getOrderStats();

      expect(stats.total).toBe(3);
      expect(stats.pending).toBe(0);
      expect(stats.processing).toBe(1);
      expect(stats.delivered).toBe(1);
      expect(stats.cancelled).toBe(1);
      expect(stats.totalRevenue).toBe(2599.98); // 2 non-cancelled orders
    });

    it('should return stats for specific user', () => {
      const stats = ordersService.getOrderStats('user1');

      expect(stats.total).toBe(2);
      expect(stats.processing).toBe(1);
      expect(stats.delivered).toBe(1);
      expect(stats.cancelled).toBe(0);
    });
  });
});
