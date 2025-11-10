# Quick Start Guide

Get the CodePilot backend up and running in 5 minutes!

## Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

## Installation

```bash
# 1. Navigate to project directory
cd codepilot-backend-test

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test levels
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # E2E tests only
```

## Starting the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start at: `http://localhost:3000`

## Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Save the `token` from the response.

### 3. Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-end laptop",
    "price": 1299.99,
    "stock": 10,
    "category": "electronics"
  }'
```

### 4. Get All Products
```bash
curl http://localhost:3000/api/products
```

### 5. Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "PRODUCT_ID_HERE",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    }
  }'
```

## Using Postman

1. Import `postman_collection.json` into Postman
2. Set the `baseUrl` variable to `http://localhost:3000`
3. Run the "Register User" or "Login User" request
4. The token will be automatically saved
5. Try other requests - authentication is handled automatically!

## Project Structure

```
src/
├── modules/
│   ├── auth/       # Authentication (register, login, JWT)
│   ├── products/   # Product management (CRUD)
│   └── orders/     # Order processing
├── middleware/     # Express middleware
├── utils/          # Utilities and error classes
└── config/         # Configuration

tests/
├── unit/           # Unit tests (79 tests)
├── integration/    # Integration tests (54 tests)
└── e2e/            # End-to-end tests (5 tests)
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm test` | Run all tests |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run test:e2e` | Run end-to-end tests only |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |

## Test Results

All tests passing! ✅

```
Test Suites: 7 passed, 7 total
Tests:       129 passed, 129 total
Coverage:    97.11% statements
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (auth required)

### Products
- `POST /api/products` - Create product (auth required)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

### Orders
- `POST /api/orders` - Create order (auth required)
- `GET /api/orders` - Get user orders (auth required)
- `GET /api/orders/:id` - Get order by ID (auth required)
- `PATCH /api/orders/:id/status` - Update order status (auth required)
- `POST /api/orders/:id/cancel` - Cancel order (auth required)
- `GET /api/orders/stats` - Get order statistics (auth required)

## Common Issues

### Port Already in Use
If port 3000 is already in use, change it in `.env`:
```env
PORT=3001
```

### Tests Failing
Make sure you're using the test environment:
```bash
NODE_ENV=test npm test
```

### Dependencies Issues
Try cleaning and reinstalling:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ Read the [README.md](README.md) for detailed documentation
2. ✅ Check [TESTING.md](TESTING.md) for testing strategy
3. ✅ Review [API.md](API.md) for complete API reference
4. ✅ Import [postman_collection.json](postman_collection.json) for interactive testing
5. ✅ Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for project overview

## Need Help?

- **Documentation**: See README.md, TESTING.md, and API.md
- **API Reference**: Import Postman collection
- **Issues**: Open a GitHub issue

## Success! 🎉

You now have a fully functional backend with:
- ✅ 3 modules (Auth, Products, Orders)
- ✅ 129 passing tests
- ✅ 97.11% code coverage
- ✅ CI/CD pipeline
- ✅ Complete documentation

Happy coding! 🚀
