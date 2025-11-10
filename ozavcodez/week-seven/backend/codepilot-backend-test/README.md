# CodePilot Backend - Comprehensive Testing Strategy

A production-ready Node.js (Express) backend API with comprehensive multi-level testing strategy, demonstrating industry best practices for unit, integration, and end-to-end testing.

## 🎯 Project Overview

This project implements a modular e-commerce backend API with three core modules:
- **Auth Module**: User authentication and authorization with JWT
- **Products Module**: Product catalog management with CRUD operations
- **Orders Module**: Order processing with inventory management

## 🏗️ Architecture

```
src/
├── config/           # Configuration files
├── middleware/       # Express middleware (auth, error handling)
├── modules/          # Feature modules
│   ├── auth/        # Authentication module
│   ├── products/    # Products module
│   └── orders/      # Orders module
└── utils/           # Utility functions and error classes

tests/
├── unit/            # Unit tests for services
├── integration/     # Integration tests for API routes
└── e2e/             # End-to-end workflow tests
```

## 🧪 Testing Strategy

### Test Levels

1. **Unit Tests** (`tests/unit/`)
   - Test individual functions and methods in isolation
   - Mock external dependencies
   - Fast execution, high coverage
   - Coverage: Service layer business logic

2. **Integration Tests** (`tests/integration/`)
   - Test API routes and controllers
   - Test middleware integration
   - Verify request/response handling
   - Coverage: HTTP endpoints and data flow

3. **End-to-End Tests** (`tests/e2e/`)
   - Test complete user workflows
   - Simulate real-world scenarios
   - Test multiple modules working together
   - Coverage: Business processes and user journeys

### Test Coverage Goals

- **Lines**: 70%+
- **Functions**: 70%+
- **Branches**: 70%+
- **Statements**: 70%+

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd codepilot-backend-test

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Running the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 🧪 Running Tests

### All Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Test by Level

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e
```

### Watch Mode

```bash
# Run tests in watch mode (useful during development)
npm run test:watch
```

### Coverage Reports

After running `npm run test:coverage`, coverage reports are generated in:
- `coverage/lcov-report/index.html` - HTML report (open in browser)
- `coverage/lcov.info` - LCOV format
- `coverage/coverage-summary.json` - JSON summary

## 📋 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Health Check
- `GET /health` - Server health check

#### Auth Module
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

#### Products Module
- `POST /api/products` - Create product (requires auth)
- `GET /api/products` - Get all products (supports filtering)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (requires auth)
- `DELETE /api/products/:id` - Delete product (requires auth)

#### Orders Module
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders` - Get user orders (requires auth)
- `GET /api/orders/:id` - Get order by ID (requires auth)
- `PATCH /api/orders/:id/status` - Update order status (requires auth)
- `POST /api/orders/:id/cancel` - Cancel order (requires auth)
- `GET /api/orders/stats` - Get order statistics (requires auth)

### Postman Collection

Import `postman_collection.json` into Postman for a complete API reference with example requests.

## 🔄 CI/CD Pipeline

### GitHub Actions

The project includes a comprehensive CI pipeline (`.github/workflows/ci.yml`) that:

1. **Runs on**:
   - Push to `main` or `develop` branches
   - Pull requests to `main` or `develop`

2. **Test Matrix**:
   - Tests against Node.js versions: 16.x, 18.x, 20.x

3. **Pipeline Steps**:
   - Code checkout
   - Dependency installation
   - Linting
   - Unit tests
   - Integration tests
   - E2E tests
   - Coverage report generation
   - Coverage upload to Codecov
   - Test artifact archiving

### Running CI Locally

```bash
# Install dependencies
npm ci

# Run linter
npm run lint

# Run all test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Generate coverage
npm run test:coverage
```

## 📊 Test Examples

### Unit Test Example

```javascript
describe('Auth Service - Unit Tests', () => {
  it('should hash a valid password', async () => {
    const password = 'password123';
    const hash = await authService.hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });
});
```

### Integration Test Example

```javascript
describe('POST /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.token).toBeDefined();
  });
});
```

### E2E Test Example

```javascript
describe('Complete Shopping Flow', () => {
  it('should complete full user journey', async () => {
    // 1. Register user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ email, password, name });
    
    // 2. Create products
    // 3. Browse products
    // 4. Place order
    // 5. Verify order
  });
});
```

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Testing**: Jest + Supertest
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, bcryptjs, CORS
- **Validation**: express-validator
- **CI/CD**: GitHub Actions

## 📈 Best Practices Implemented

### Testing Best Practices

1. **Test Isolation**: Each test is independent and can run in any order
2. **Clear Test Names**: Descriptive test names that explain what is being tested
3. **AAA Pattern**: Arrange, Act, Assert structure in tests
4. **Test Data Management**: Cleanup before/after each test
5. **Mocking**: Appropriate use of mocks for external dependencies
6. **Coverage Thresholds**: Enforced minimum coverage requirements

### Code Best Practices

1. **Modular Architecture**: Clear separation of concerns
2. **Error Handling**: Centralized error handling middleware
3. **Async/Await**: Consistent async error handling
4. **Input Validation**: Comprehensive input validation
5. **Security**: JWT authentication, password hashing, security headers
6. **Logging**: Structured logging with environment-aware output

## 🔍 Code Quality

### Linting

```bash
npm run lint
```

ESLint is configured with recommended rules for Node.js projects.

### Test Coverage

Current coverage can be viewed by running:
```bash
npm run test:coverage
```

Coverage reports show:
- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

## 🐛 Debugging Tests

### Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- --testNamePattern="Auth Service"

# Run tests in a specific file
npm test -- tests/unit/auth.service.test.js

# Run with verbose output
npm test -- --verbose
```

### Debug Mode

```bash
# Run tests with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📝 Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=24h
```

For testing, use `.env.test` (already configured).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Ensure coverage thresholds are met
6. Submit a pull request

## 📄 License

MIT License

## 👥 Team

CodePilot Engineering Team

---

## 🎓 Learning Outcomes

This project demonstrates:

- ✅ Multi-level testing strategy (unit, integration, e2e)
- ✅ Test-driven development practices
- ✅ Modular backend architecture
- ✅ RESTful API design
- ✅ JWT authentication implementation
- ✅ Error handling and validation
- ✅ CI/CD pipeline setup
- ✅ Code coverage reporting
- ✅ API documentation
- ✅ Best practices for production-ready code

## 📞 Support

For questions or issues, please open an issue in the repository.
