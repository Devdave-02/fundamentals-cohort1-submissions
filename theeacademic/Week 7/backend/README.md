# CodePilot Backend - Test Strategy & Coverage# FlowServe Backend API



> **A comprehensive testing implementation demonstrating best practices for ensuring code coverage and deployment confidence**Express + Prisma + PostgreSQL backend for the FlowServe fintech challenge. It demonstrates scalable, modular API design with validation, logging, pagination, rate limiting, and robust error handling.



## 📋 Table of Contents## Features



- [Overview](#overview)- Node.js + Express.js

- [Testing Strategy](#testing-strategy)- PostgreSQL with Prisma ORM

- [Test Coverage Goals](#test-coverage-goals)- Modular routes, controllers, and services

- [Architecture](#architecture)- Zod-based request validation (body, params, query)

- [Getting Started](#getting-started)- Centralized error handling with consistent JSON responses

- [Running Tests](#running-tests)- Pagination on list endpoints

- [CI/CD Pipeline](#cicd-pipeline)- Pino logging (pretty in development)

- [API Documentation](#api-documentation)- Global rate limiting with `express-rate-limit`

- CORS enabled

---- Postman collection included: `FlowServe_API.postman_collection.json`



## 🎯 Overview## Getting started



CodePilot Backend is an internal developer platform API built with **Express.js**, **Prisma ORM**, and **PostgreSQL**. This project implements a comprehensive test strategy with:### Prerequisites



- ✅ **Unit Tests** for business logic isolation- Node.js 18+

- ✅ **Integration Tests** for API endpoint validation  - PostgreSQL database (local or remote)

- ✅ **80%+ Code Coverage** threshold enforcement

- ✅ **Automated CI/CD** with GitHub Actions### 1) Configure environment

- ✅ **Test-Driven Development** practices

Copy `.env.example` to `.env` and adjust as needed:

---

```

## 🧪 Testing Strategycp .env.example .env

```

### Philosophy: Coverage + Confidence

Required variables:

Our testing strategy balances **quantitative coverage metrics** with **qualitative confidence** in system reliability. We follow these principles:

- `DATABASE_URL` – PostgreSQL connection string

1. **Test Pyramid Approach**- `PORT` – server port (default: 3000)

   - **70% Unit Tests** - Fast, isolated, numerous- `RATE_LIMIT_WINDOW_MS` – window in ms (default: 900000)

   - **20% Integration Tests** - API contracts and workflows- `RATE_LIMIT_MAX` – max requests per window (default: 100)

   - **10% E2E Tests** - Critical user journeys

### 2) Install dependencies

2. **Meaningful Tests Over Metrics**

   - Focus on business logic and edge cases```

   - Avoid testing implementation detailsnpm install

   - Test behavior, not code structure```



3. **Fast Feedback Loops**This will also run `prisma generate` to create the Prisma Client.

   - Tests run in < 30 seconds

   - Parallel execution where possible### 3) Run database migrations

   - Quick local development cycle

Make sure your `DATABASE_URL` is set correctly in `.env`, then run:

### What We Test

```

#### ✅ Unit Testsnpx prisma migrate dev --name init

- **Services**: Business logic, data validation, error handling```

- **Utils**: Helper functions, formatters, validators

- **Controllers**: Request/response handling (with mocked services)This will create the database schema defined in `prisma/schema.prisma`.



#### ✅ Integration TestsOptionally, open Prisma Studio to inspect data:

- **API Endpoints**: HTTP request/response cycles

- **Database Operations**: Prisma queries and transactions```

- **Middleware**: Authentication, validation, error handlingnpx prisma studio

- **End-to-End Workflows**: Multi-step user scenarios```



#### ❌ What We Don't Test### 4) Start the server

- Third-party library internals

- Database ORM implementation (Prisma)Development mode (auto-reload):

- Framework behavior (Express)

- Generated code (Prisma Client)```

npm run dev

---```



## 📊 Test Coverage GoalsProduction mode:



### Coverage Thresholds```

npm start

```json```

{

  "branches": 80,The API will be available at `http://localhost:3000/api` and health check at `http://localhost:3000/health`.

  "functions": 80,

  "lines": 80,## API Overview

  "statements": 80

}Base URL: `http://localhost:3000/api`

```

### Users

### Why 80%?

- `GET /users` – List users with pagination

- **Practical Balance**: Catches most bugs without excessive test maintenance	- Query: `page`, `limit`, `search`

- **Industry Standard**: Aligns with best practices (Google, Netflix, etc.)- `GET /users/:id` – Get user by ID

- **Diminishing Returns**: 80-90% coverage offers best effort/value ratio- `POST /users` – Create user

- **Focus on Quality**: Leaves room for judgment on trivial code	- Body: `{ name: string, email: string }`

- `PUT /users/:id` – Update user

---	- Body: `{ name?: string, email?: string }`

- `DELETE /users/:id` – Delete user

## 🚀 Getting Started

### Transactions

### Prerequisites

- `GET /transactions` – List transactions with pagination

- Node.js >= 18.0.0	- Query: `page`, `limit`, `userId?`

- PostgreSQL >= 13- `GET /transactions/:id` – Get transaction by ID

- npm or yarn- `POST /transactions` – Create (simulate) transaction

	- Body: `{ userId: uuid, type: 'CREDIT'|'DEBIT', amount: '100.00', description?: string }`

### Installation	- Debits validate sufficient funds and adjust user balance atomically.

- `PUT /transactions/:id` – Update transaction (description only)

```bash- `DELETE /transactions/:id` – Delete transaction and reverse its balance effect

# Clone the repository

git clone <repository-url>### Response format

cd codepilot-backend

All responses use a consistent shape:

# Install dependencies

npm install```

{ "success": boolean, "data"?: any, "pagination"?: {...}, "message"?: string, "details"?: any }

# Setup environment variables```

cp .env.example .env

Pagination responses include `{ page, limit, total, totalPages }`.

# Configure your .env file

DATABASE_URL=postgresql://user:password@localhost:5432/codepilot### Validation and errors

NODE_ENV=development

PORT=3000- Zod validates all inputs; validation errors return 400 with details

- Not found returns 404

# Run Prisma migrations- Rate limiting returns 429

npx prisma migrate dev- Server errors return 500 with a generic message



# Generate Prisma Client## Project structure

npx prisma generate

```

# Start the development serversrc/

npm run dev	config/       # env, logger, prisma, rate limit

```	controllers/  # request handlers (thin)

	services/     # business logic (Prisma)

---	validators/   # Zod schemas

	middleware/   # error handler, validation

## 🧪 Running Tests	routes/       # express routers

	app.js        # express app

### Quick Start	server.js     # server bootstrap

prisma/

```bash	schema.prisma

# Run all tests```

npm test

## Postman Collection

# Run with coverage report

npm run test:coverageImport `FlowServe_API.postman_collection.json` into Postman to try all endpoints. The collection is configured with a `baseUrl` variable defaulting to `http://localhost:3000/api`.



# Run in watch mode (for development)## Notes

npm run test:watch

```- Prisma Client is generated on `npm install` via the `postinstall` script.

- The server connects to the database lazily on the first Prisma query, so it can start even if the DB is temporarily offline.

### Test Types

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Specific test file
npm test -- user.service.test.js

# Tests matching pattern
npm test -- --testNamePattern="create user"
```

### Coverage Reports

```bash
# Generate HTML coverage report
npm run test:coverage

# Open coverage report in browser
open coverage/lcov-report/index.html
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Our CI pipeline runs on every push and pull request:

```yaml
Workflow: CI/CD Pipeline
├── Test Job (Node 18.x, 20.x)
│   ├── Setup PostgreSQL service
│   ├── Install dependencies
│   ├── Run Prisma migrations
│   ├── Run unit tests
│   ├── Run integration tests
│   ├── Generate coverage report
│   └── Upload coverage to Codecov
├── Lint Job
│   └── Run ESLint
└── Build Job
    └── Verify build succeeds
```

### Pipeline Features

- ✅ **Matrix Testing**: Tests against Node 18 and 20
- ✅ **Service Containers**: PostgreSQL for integration tests
- ✅ **Coverage Tracking**: Automatic Codecov integration
- ✅ **Artifact Storage**: Coverage reports saved for 30 days
- ✅ **Fail Fast**: Pipeline fails if coverage drops below 80%

---

## 📚 API Documentation

### Postman Collection

Import the Postman collection for full API documentation:

```bash
# File: FlowServe_API.postman_collection.json
```

### Key Endpoints

#### Users

```http
GET    /api/users          # List all users
GET    /api/users/:id      # Get user by ID
POST   /api/users          # Create new user
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
```

#### Transactions

```http
GET    /api/transactions          # List all transactions
GET    /api/transactions/:id      # Get transaction by ID
POST   /api/transactions          # Create transaction
GET    /api/transactions/user/:id # Get user transactions
```

### Example Requests

#### Create User

```bash
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "balance": 1000
}
```

#### Create Transaction

```bash
POST /api/transactions
Content-Type: application/json

{
  "userId": 1,
  "type": "deposit",
  "amount": 500,
  "description": "Initial deposit"
}
```

---

## 🛠️ Testing Best Practices Implemented

### 1. Test Isolation
- Each test is independent
- Database reset between tests
- No shared mutable state

### 2. Clear Test Names
```javascript
describe('User Service', () => {
  it('should create a user with valid data', async () => {
    // Test implementation
  });
  
  it('should throw error when email already exists', async () => {
    // Test implementation
  });
});
```

### 3. AAA Pattern (Arrange-Act-Assert)
```javascript
it('should update user balance', async () => {
  // Arrange
  const user = await createTestUser();
  
  // Act
  const result = await userService.updateBalance(user.id, 500);
  
  // Assert
  expect(result.balance).toBe(1500);
});
```

### 4. Mocking External Dependencies
```javascript
jest.mock('../../src/config/database', () => ({
  prisma: createMockPrismaClient()
}));
```

---

## 📈 Testing Strategy Document

### Coverage vs. Confidence Trade-offs

**Coverage Metrics** provide quantitative data about what code is executed during tests, but they don't guarantee quality. Our approach:

1. **Prioritize Critical Paths**: 95%+ coverage for core business logic
2. **Accept Lower Coverage for**: Configuration files, simple getters/setters
3. **Focus on Edge Cases**: Test error conditions, boundary values, race conditions
4. **Measure Confidence**: Can we deploy with confidence? Do tests catch real bugs?

### Test Maintenance Strategy

- **Regular Review**: Quarterly review of flaky tests
- **Refactoring**: Keep tests DRY with shared utilities
- **Documentation**: Each test file has clear describe blocks
- **Performance**: Monitor test execution time, optimize slow tests

---

## 📄 License

MIT License

## 👨‍💻 Author

@theeacademic

---

**Remember**: Good tests don't just increase coverage—they increase confidence! 🚀
