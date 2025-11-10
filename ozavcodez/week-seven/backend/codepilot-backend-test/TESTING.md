# Testing Strategy Documentation

## Overview

This document provides detailed information about the testing strategy implemented in the CodePilot backend project.

## Testing Pyramid

Our testing strategy follows the testing pyramid approach:

```
        /\
       /  \
      / E2E \
     /--------\
    /          \
   / Integration\
  /--------------\
 /                \
/      Unit        \
--------------------
```

- **Unit Tests (Base)**: 60% of tests - Fast, isolated, test individual functions
- **Integration Tests (Middle)**: 30% of tests - Test API endpoints and module interactions
- **E2E Tests (Top)**: 10% of tests - Test complete user workflows

## Test Structure

### Unit Tests

**Location**: `tests/unit/`

**Purpose**: Test individual service methods in isolation

**Characteristics**:
- Fast execution (< 1ms per test)
- No external dependencies
- High coverage of business logic
- Test edge cases and error conditions

**Example Structure**:
```javascript
describe('Service Name - Unit Tests', () => {
  beforeEach(() => {
    // Setup test data
  });

  describe('methodName', () => {
    it('should handle success case', () => {
      // Test implementation
    });

    it('should handle error case', () => {
      // Test implementation
    });
  });
});
```

**Files**:
- `auth.service.test.js` - Authentication service tests (87 tests)
- `products.service.test.js` - Products service tests (45 tests)
- `orders.service.test.js` - Orders service tests (52 tests)

### Integration Tests

**Location**: `tests/integration/`

**Purpose**: Test API routes and HTTP layer

**Characteristics**:
- Test complete request/response cycle
- Include middleware execution
- Test authentication and authorization
- Verify HTTP status codes and response format

**Example Structure**:
```javascript
describe('Route Name - Integration Tests', () => {
  let token;

  beforeEach(async () => {
    // Setup authentication
  });

  describe('POST /api/endpoint', () => {
    it('should handle authenticated request', async () => {
      const response = await request(app)
        .post('/api/endpoint')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      expect(response.status).toBe(201);
    });
  });
});
```

**Files**:
- `auth.routes.test.js` - Auth endpoints (12 tests)
- `products.routes.test.js` - Products endpoints (18 tests)
- `orders.routes.test.js` - Orders endpoints (24 tests)

### End-to-End Tests

**Location**: `tests/e2e/`

**Purpose**: Test complete user workflows and business processes

**Characteristics**:
- Test multiple modules together
- Simulate real user scenarios
- Verify data consistency across modules
- Test complex business logic

**Example Structure**:
```javascript
describe('E2E - User Journey Name', () => {
  it('should complete full workflow', async () => {
    // Step 1: User action
    // Step 2: System response
    // Step 3: Verification
    // ... multiple steps
  });
});
```

**Files**:
- `user-journey.test.js` - Complete user workflows (5 major scenarios)

## Test Coverage

### Coverage Metrics

We enforce minimum coverage thresholds:

```json
{
  "branches": 70,
  "functions": 70,
  "lines": 70,
  "statements": 70
}
```

### Coverage Reports

After running `npm run test:coverage`, you'll find:

1. **HTML Report**: `coverage/lcov-report/index.html`
   - Visual representation
   - Line-by-line coverage
   - Interactive navigation

2. **LCOV Report**: `coverage/lcov.info`
   - Standard format for CI tools
   - Used by Codecov

3. **JSON Summary**: `coverage/coverage-summary.json`
   - Programmatic access to metrics

### Viewing Coverage

```bash
# Generate coverage
npm run test:coverage

# Open HTML report (Windows)
start coverage/lcov-report/index.html

# Open HTML report (Mac/Linux)
open coverage/lcov-report/index.html
```

## Test Data Management

### Setup and Teardown

Each test suite includes proper setup and teardown:

```javascript
beforeEach(() => {
  // Clear all data stores
  authService.clearUsers();
  productsService.clearProducts();
  ordersService.clearOrders();
});
```

### Test Isolation

- Each test is independent
- Tests can run in any order
- No shared state between tests
- Clean slate for each test

### Test Fixtures

Common test data patterns:

```javascript
// User fixture
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

// Product fixture
const testProduct = {
  name: 'Test Product',
  price: 99.99,
  stock: 10,
  category: 'electronics'
};

// Order fixture
const testOrder = {
  items: [{ productId: 'xxx', quantity: 2 }],
  shippingAddress: {
    street: '123 Main St',
    city: 'New York'
  }
};
```

## Running Tests

### Basic Commands

```bash
# All tests
npm test

# Specific level
npm run test:unit
npm run test:integration
npm run test:e2e

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Advanced Options

```bash
# Run specific test file
npm test -- tests/unit/auth.service.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should register"

# Run with verbose output
npm test -- --verbose

# Run in band (sequential)
npm test -- --runInBand

# Update snapshots
npm test -- --updateSnapshot
```

## Test Patterns

### AAA Pattern

All tests follow the Arrange-Act-Assert pattern:

```javascript
it('should create a product', () => {
  // Arrange
  const productData = { name: 'Laptop', price: 999.99, stock: 5 };

  // Act
  const product = productsService.createProduct(
    productData.name,
    '',
    productData.price,
    productData.stock
  );

  // Assert
  expect(product).toBeDefined();
  expect(product.name).toBe('Laptop');
});
```

### Error Testing

Testing error conditions:

```javascript
it('should throw ValidationError for invalid data', () => {
  expect(() => {
    productsService.createProduct('', -1, 10);
  }).toThrow(ValidationError);
});

// For async functions
it('should reject with UnauthorizedError', async () => {
  await expect(
    authService.login('wrong@email.com', 'password')
  ).rejects.toThrow(UnauthorizedError);
});
```

### Async Testing

Handling asynchronous operations:

```javascript
// Using async/await
it('should hash password', async () => {
  const hash = await authService.hashPassword('password123');
  expect(hash).toBeDefined();
});

// Using supertest for HTTP
it('should return 200', async () => {
  const response = await request(app)
    .get('/api/products');
  
  expect(response.status).toBe(200);
});
```

## Best Practices

### 1. Test Naming

Use descriptive names that explain what is being tested:

```javascript
// Good
it('should return 401 when token is missing', () => {});

// Bad
it('test auth', () => {});
```

### 2. One Assertion Per Test

Focus each test on a single behavior:

```javascript
// Good
it('should create user with correct email', () => {
  const user = createUser(data);
  expect(user.email).toBe('test@example.com');
});

it('should create user with hashed password', () => {
  const user = createUser(data);
  expect(user.password).not.toBe('plaintext');
});

// Avoid
it('should create user correctly', () => {
  const user = createUser(data);
  expect(user.email).toBe('test@example.com');
  expect(user.password).not.toBe('plaintext');
  expect(user.name).toBe('Test');
  // Too many assertions
});
```

### 3. Test Edge Cases

Always test boundary conditions:

```javascript
describe('validateProduct', () => {
  it('should accept minimum valid price (0)', () => {});
  it('should reject negative price', () => {});
  it('should accept empty description', () => {});
  it('should reject empty name', () => {});
});
```

### 4. Use Setup Functions

Keep tests DRY with helper functions:

```javascript
async function createAuthenticatedUser() {
  const response = await request(app)
    .post('/api/auth/register')
    .send(testUserData);
  
  return response.body.data.token;
}

// Use in tests
it('should access protected route', async () => {
  const token = await createAuthenticatedUser();
  // ... rest of test
});
```

### 5. Mock External Dependencies

For unit tests, mock external services:

```javascript
// Mock database calls
jest.mock('../database', () => ({
  query: jest.fn()
}));

// Mock external APIs
jest.mock('axios');
```

## Debugging Tests

### Using Console Logs

```javascript
it('should debug test', () => {
  console.log('Debug info:', someVariable);
  // Test code
});
```

### Using Debugger

```javascript
it('should debug with breakpoint', () => {
  debugger; // Breakpoint
  // Test code
});
```

Run with:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Isolating Tests

```javascript
// Run only this test
it.only('should run only this test', () => {});

// Skip this test
it.skip('should skip this test', () => {});
```

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Every push to main/develop
- Every pull request
- Multiple Node.js versions (16.x, 18.x, 20.x)

### Coverage Reports

- Uploaded to Codecov
- PR comments with coverage diff
- Fail build if coverage drops below threshold

### Test Artifacts

- Coverage reports archived
- Test logs saved
- Available for download from GitHub Actions

## Continuous Improvement

### Adding New Tests

When adding new features:

1. Write unit tests for service methods
2. Write integration tests for API endpoints
3. Add E2E tests for new workflows
4. Ensure coverage thresholds are met

### Refactoring Tests

When refactoring:

1. Keep tests passing during refactoring
2. Update tests if behavior changes
3. Remove obsolete tests
4. Maintain coverage levels

### Test Maintenance

Regular maintenance tasks:

- Remove flaky tests
- Update test data
- Improve test performance
- Add missing test cases
- Update documentation

## Metrics and Reporting

### Test Execution Time

Monitor test performance:

```bash
# Run with timing
npm test -- --verbose

# Identify slow tests
npm test -- --detectOpenHandles
```

### Coverage Trends

Track coverage over time:
- Set up coverage badges
- Monitor coverage in CI
- Review coverage reports regularly

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)

### Tools
- Jest - Test framework
- Supertest - HTTP assertions
- Codecov - Coverage reporting
- GitHub Actions - CI/CD

## Conclusion

This comprehensive testing strategy ensures:
- High code quality
- Confidence in deployments
- Fast feedback loops
- Maintainable test suite
- Clear documentation

Follow these guidelines to maintain and improve the test suite.
