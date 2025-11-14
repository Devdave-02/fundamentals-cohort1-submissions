// Test setup file
const authService = require('../src/modules/auth/auth.service');
const productsService = require('../src/modules/products/products.service');
const ordersService = require('../src/modules/orders/orders.service');

// Clear all data before each test suite
beforeEach(() => {
  authService.clearUsers();
  productsService.clearProducts();
  ordersService.clearOrders();
});

// Global test timeout
jest.setTimeout(10000);
