# CodePilot Backend API

A comprehensive Node.js (Express) backend API with modular architecture and extensive test coverage.

## Features

- **Modular Architecture**: Separated into auth, products, orders, and users modules
- **Comprehensive Testing**: Unit, integration, and E2E tests
- **Code Coverage**: 80%+ coverage threshold enforced
- **CI/CD**: Automated testing with GitHub Actions
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request validation using express-validator

## Project Structure

```
backend/
├── src/
│   ├── server.js              # Express app entry point
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── products.js        # Product management routes
│   │   ├── orders.js          # Order management routes
│   │   └── users.js           # User profile routes
│   └── services/
│       ├── authService.js     # Authentication business logic
│       ├── productService.js  # Product business logic
│       ├── orderService.js    # Order business logic
│       └── userService.js     # User business logic
├── tests/
│   ├── unit/                  # Unit tests for services
│   ├── integration/           # Integration tests for routes
│   └── e2e/                   # End-to-end workflow tests
├── coverage/                  # Coverage reports (generated)
└── .github/workflows/         # GitHub Actions CI
```

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - API health status

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with filters: category, minPrice, maxPrice)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (requires auth)
- `PUT /api/products/:id` - Update product (requires auth)
- `DELETE /api/products/:id` - Delete product (requires auth)

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders` - Get user orders (requires auth)
- `GET /api/orders/:id` - Get order by ID (requires auth)
- `PATCH /api/orders/:id/status` - Update order status (requires auth)
- `POST /api/orders/:id/cancel` - Cancel order (requires auth)

### Users
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

## Testing Strategy

### Overview

Our testing strategy ensures both **broad coverage** and **high confidence** through a multi-layered approach:

1. **Unit Tests** - Test individual functions and services in isolation
2. **Integration Tests** - Test API routes and service interactions
3. **E2E Tests** - Test complete user workflows

### Test Coverage Goals

- **Minimum Threshold**: 80% coverage across branches, functions, lines, and statements
- **Coverage Reports**: Generated in `/coverage` directory
- **CI Enforcement**: Tests must pass and coverage thresholds must be met

### Test Levels

#### 1. Unit Tests (`tests/unit/`)

Purpose: Test individual service functions in isolation with mocked dependencies.

**Coverage**:
- `authService.test.js` - Password hashing, token generation, user registration/login
- `productService.test.js` - Product CRUD operations, filtering, stock management
- `orderService.test.js` - Order creation, status updates, stock management

**Best Practices Applied**:
- Isolated tests (no side effects between tests)
- Testing edge cases (invalid inputs, non-existent resources)
- Testing error conditions
- Fast execution (< 1 second per test suite)

#### 2. Integration Tests (`tests/integration/`)

Purpose: Test API routes with real HTTP requests, including middleware and service interactions.

**Coverage**:
- `auth.test.js` - Registration/login flows, validation
- `products.test.js` - Product API endpoints, authentication, filtering
- `orders.test.js` - Order API endpoints, authentication, status management
- `users.test.js` - User profile endpoints, authentication

**Best Practices Applied**:
- Real HTTP requests using Supertest
- Testing authentication middleware
- Testing request validation
- Testing error responses
- Testing status codes

#### 3. E2E Tests (`tests/e2e/`)

Purpose: Test complete user workflows from start to finish.

**Coverage**:
- `workflow.test.js` - Complete user journey:
  - Registration → Login → View Products → Create Order → View Order → Update Profile
  - Order cancellation workflow
  - Product management workflow

**Best Practices Applied**:
- Testing real-world scenarios
- Testing complete workflows
- Testing state transitions
- Verifying data consistency

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only E2E tests
npm run test:e2e

# Watch mode for development
npm run test:watch
```

### Coverage Reports

After running tests, coverage reports are generated in:
- `coverage/lcov-report/index.html` - HTML report (open in browser)
- `coverage/coverage-final.json` - JSON report (for CI/CD)

### CI/CD Integration

GitHub Actions automatically:
1. Runs all tests on push/PR
2. Enforces coverage thresholds
3. Uploads coverage reports as artifacts
4. Tests on multiple Node.js versions (18.x, 20.x)

## How Tests Ensure Coverage and Confidence

### Coverage (Breadth)

1. **Code Coverage**: Jest collects coverage metrics for all source files
2. **Threshold Enforcement**: 80% minimum enforced in `package.json`
3. **Multiple Test Levels**: Unit + Integration + E2E ensures all code paths are tested
4. **Edge Case Testing**: Tests cover error conditions, invalid inputs, boundary cases

### Confidence (Depth)

1. **Real Scenarios**: E2E tests verify complete workflows work end-to-end
2. **Service Isolation**: Unit tests verify business logic independently
3. **API Contract**: Integration tests verify API contracts and middleware
4. **State Management**: Tests verify data consistency (e.g., stock updates on orders)
5. **Error Handling**: Tests verify proper error responses and status codes
6. **Authentication**: Tests verify security middleware works correctly

## API Documentation

See `postman_collection.json` for Postman API collection with all endpoints.

## Development

### Adding New Features

1. Write service function in appropriate service file
2. Write unit tests for the service function
3. Add route handler in appropriate route file
4. Write integration tests for the route
5. Update E2E tests if workflow changes
6. Ensure coverage remains above 80%

### Code Quality

- Follow existing code patterns
- Write tests before or alongside code
- Ensure all tests pass locally before pushing
- Maintain test coverage above threshold

## License

ISC
