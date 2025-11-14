# Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  (Postman, cURL, Frontend Apps, Mobile Apps, API Consumers)     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Express.js Server                           │
│                     (Port 3000/3001)                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Middleware Layer                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐   │
│  │   Helmet     │ │    CORS      │ │   Body Parser        │   │
│  │  (Security)  │ │ (Cross-Orig) │ │ (JSON/URL-encoded)   │   │
│  └──────────────┘ └──────────────┘ └──────────────────────┘   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐   │
│  │   Logger     │ │ Authenticate │ │   Error Handler      │   │
│  │ (Requests)   │ │   (JWT)      │ │  (Centralized)       │   │
│  └──────────────┘ └──────────────┘ └──────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Routing Layer                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /api/auth/*      →  Auth Routes                         │  │
│  │  /api/products/*  →  Products Routes                     │  │
│  │  /api/orders/*    →  Orders Routes                       │  │
│  │  /health          →  Health Check                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Controller Layer                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐   │
│  │    Auth      │ │   Products   │ │      Orders          │   │
│  │  Controller  │ │  Controller  │ │    Controller        │   │
│  │              │ │              │ │                      │   │
│  │ - register   │ │ - create     │ │ - createOrder        │   │
│  │ - login      │ │ - getAll     │ │ - getAllOrders       │   │
│  │ - getMe      │ │ - getById    │ │ - getById            │   │
│  │              │ │ - update     │ │ - updateStatus       │   │
│  │              │ │ - delete     │ │ - cancel             │   │
│  │              │ │              │ │ - getStats           │   │
│  └──────┬───────┘ └──────┬───────┘ └──────────┬───────────┘   │
└─────────┼────────────────┼────────────────────┼────────────────┘
          │                │                    │
          │                │                    │
┌─────────▼────────────────▼────────────────────▼────────────────┐
│                     Service Layer                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐   │
│  │    Auth      │ │   Products   │ │      Orders          │   │
│  │   Service    │ │   Service    │ │     Service          │   │
│  │              │ │              │ │                      │   │
│  │ Business     │ │ Business     │ │ Business Logic:      │   │
│  │ Logic:       │ │ Logic:       │ │ - Validation         │   │
│  │ - Hash pwd   │ │ - Validation │ │ - Stock mgmt         │   │
│  │ - JWT gen    │ │ - CRUD ops   │ │ - Order creation     │   │
│  │ - JWT verify │ │ - Filtering  │ │ - Status updates     │   │
│  │ - User mgmt  │ │ - Stock mgmt │ │ - Cancellation       │   │
│  │              │ │              │ │ - Statistics         │   │
│  └──────┬───────┘ └──────┬───────┘ └──────────┬───────────┘   │
└─────────┼────────────────┼────────────────────┼────────────────┘
          │                │                    │
          │                │                    │
┌─────────▼────────────────▼────────────────────▼────────────────┐
│                     Data Layer                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐   │
│  │    Users     │ │   Products   │ │      Orders          │   │
│  │   (Map)      │ │    (Map)     │ │       (Map)          │   │
│  │              │ │              │ │                      │   │
│  │ In-Memory    │ │ In-Memory    │ │ In-Memory Storage    │   │
│  │ Storage      │ │ Storage      │ │ (Production: DB)     │   │
│  └──────────────┘ └──────────────┘ └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Module Architecture

### Auth Module

```
┌─────────────────────────────────────────────────────────────┐
│                        Auth Module                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  auth.routes.js                                             │
│  ├── POST   /register                                       │
│  ├── POST   /login                                          │
│  └── GET    /me  (protected)                                │
│                                                              │
│  auth.controller.js                                         │
│  ├── register(req, res)                                     │
│  ├── login(req, res)                                        │
│  └── getCurrentUser(req, res)                               │
│                                                              │
│  auth.service.js                                            │
│  ├── hashPassword(password)                                 │
│  ├── comparePassword(password, hash)                        │
│  ├── generateToken(userId, email)                           │
│  ├── verifyToken(token)                                     │
│  ├── register(email, password, name)                        │
│  ├── login(email, password)                                 │
│  ├── getUserById(userId)                                    │
│  ├── getAllUsers()                                          │
│  └── clearUsers()                                           │
│                                                              │
│  auth.middleware.js                                         │
│  └── authenticate(req, res, next)                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Products Module

```
┌─────────────────────────────────────────────────────────────┐
│                     Products Module                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  products.routes.js                                         │
│  ├── POST   /  (protected)                                  │
│  ├── GET    /                                               │
│  ├── GET    /:id                                            │
│  ├── PUT    /:id  (protected)                               │
│  └── DELETE /:id  (protected)                               │
│                                                              │
│  products.controller.js                                     │
│  ├── createProduct(req, res)                                │
│  ├── getAllProducts(req, res)                               │
│  ├── getProductById(req, res)                               │
│  ├── updateProduct(req, res)                                │
│  └── deleteProduct(req, res)                                │
│                                                              │
│  products.service.js                                        │
│  ├── validateProduct(name, price, stock)                    │
│  ├── createProduct(name, desc, price, stock, category)      │
│  ├── getAllProducts(filters)                                │
│  ├── getProductById(productId)                              │
│  ├── updateProduct(productId, updates)                      │
│  ├── deleteProduct(productId)                               │
│  ├── updateStock(productId, quantity)                       │
│  ├── isAvailable(productId, quantity)                       │
│  └── clearProducts()                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Orders Module

```
┌─────────────────────────────────────────────────────────────┐
│                      Orders Module                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  orders.routes.js                                           │
│  ├── POST   /  (protected)                                  │
│  ├── GET    /  (protected)                                  │
│  ├── GET    /stats  (protected)                             │
│  ├── GET    /:id  (protected)                               │
│  ├── PATCH  /:id/status  (protected)                        │
│  └── POST   /:id/cancel  (protected)                        │
│                                                              │
│  orders.controller.js                                       │
│  ├── createOrder(req, res)                                  │
│  ├── getAllOrders(req, res)                                 │
│  ├── getOrderById(req, res)                                 │
│  ├── updateOrderStatus(req, res)                            │
│  ├── cancelOrder(req, res)                                  │
│  └── getOrderStats(req, res)                                │
│                                                              │
│  orders.service.js                                          │
│  ├── validateOrderItems(items)                              │
│  ├── calculateTotal(items)                                  │
│  ├── createOrder(userId, items, shippingAddress)            │
│  ├── getAllOrders(filters)                                  │
│  ├── getOrderById(orderId)                                  │
│  ├── getOrdersByUserId(userId)                              │
│  ├── updateOrderStatus(orderId, status)                     │
│  ├── cancelOrder(orderId, userId)                           │
│  ├── getOrderStats(userId)                                  │
│  └── clearOrders()                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Registration Flow

```
Client Request
    │
    ▼
POST /api/auth/register
    │
    ▼
auth.routes.js
    │
    ▼
auth.controller.register()
    │
    ▼
auth.service.register()
    │
    ├─► Validate input
    ├─► Check if user exists
    ├─► Hash password (bcrypt)
    ├─► Create user object
    ├─► Store in users Map
    ├─► Generate JWT token
    └─► Return user + token
    │
    ▼
Response to Client
```

### Create Order Flow

```
Client Request (with JWT)
    │
    ▼
POST /api/orders
    │
    ▼
auth.middleware.authenticate()
    │
    ├─► Extract JWT from header
    ├─► Verify token
    └─► Attach user to request
    │
    ▼
orders.routes.js
    │
    ▼
orders.controller.createOrder()
    │
    ▼
orders.service.createOrder()
    │
    ├─► Validate order items
    │   └─► Check product exists (products.service)
    │       └─► Check stock availability
    │
    ├─► Calculate order total
    │   └─► Get product prices
    │
    ├─► Create order object
    │
    ├─► Update product stock
    │   └─► products.service.updateStock()
    │
    ├─► Store order in orders Map
    │
    └─► Return order details
    │
    ▼
Response to Client
```

## Testing Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Test Pyramid                            │
│                                                              │
│                        ╱╲                                    │
│                       ╱  ╲                                   │
│                      ╱ E2E╲                                  │
│                     ╱  (5) ╲                                 │
│                    ╱────────╲                                │
│                   ╱          ╲                               │
│                  ╱Integration ╲                              │
│                 ╱     (54)     ╲                             │
│                ╱────────────────╲                            │
│               ╱                  ╲                           │
│              ╱       Unit         ╲                          │
│             ╱        (79)          ╲                         │
│            ╱────────────────────────╲                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Unit Tests (79)
├── auth.service.test.js (22 tests)
├── products.service.test.js (29 tests)
└── orders.service.test.js (28 tests)

Integration Tests (54)
├── auth.routes.test.js (10 tests)
├── products.routes.test.js (15 tests)
└── orders.routes.test.js (21 tests)

E2E Tests (5)
└── user-journey.test.js
    ├── Complete shopping flow
    ├── Order cancellation flow
    ├── Multiple users flow
    ├── Product management flow
    └── Authentication flow
```

## Error Handling Flow

```
Error Occurs
    │
    ▼
Is it an AppError?
    │
    ├─ Yes ─► Operational Error
    │         │
    │         ├─ ValidationError (400)
    │         ├─ UnauthorizedError (401)
    │         ├─ ForbiddenError (403)
    │         ├─ NotFoundError (404)
    │         └─ ConflictError (409)
    │         │
    │         ▼
    │     Return error.message
    │
    └─ No ──► Programming Error
              │
              ▼
          Log full error
              │
              ▼
     Return "Internal server error"
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  JWT Authentication                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User Login                                              │
│     ├─► Validate credentials                                │
│     ├─► Generate JWT token                                  │
│     │   ├─ Payload: { userId, email }                       │
│     │   ├─ Secret: JWT_SECRET                               │
│     │   └─ Expiry: JWT_EXPIRES_IN                           │
│     └─► Return token to client                              │
│                                                              │
│  2. Protected Request                                       │
│     ├─► Extract token from header                           │
│     │   └─ Authorization: Bearer <token>                    │
│     ├─► Verify token                                        │
│     │   ├─ Check signature                                  │
│     │   ├─ Check expiration                                 │
│     │   └─ Decode payload                                   │
│     ├─► Attach user to request                              │
│     │   └─ req.user = { userId, email }                     │
│     └─► Continue to route handler                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
codepilot-backend-test/
│
├── src/                          # Source code
│   ├── config/                   # Configuration
│   │   └── config.js            # App configuration
│   │
│   ├── middleware/               # Express middleware
│   │   ├── asyncHandler.js      # Async error handler
│   │   └── errorHandler.js      # Global error handler
│   │
│   ├── modules/                  # Feature modules
│   │   ├── auth/                # Authentication
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.middleware.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.service.js
│   │   │
│   │   ├── products/            # Products management
│   │   │   ├── products.controller.js
│   │   │   ├── products.routes.js
│   │   │   └── products.service.js
│   │   │
│   │   └── orders/              # Orders management
│   │       ├── orders.controller.js
│   │       ├── orders.routes.js
│   │       └── orders.service.js
│   │
│   ├── utils/                    # Utilities
│   │   ├── errors.js            # Custom error classes
│   │   └── logger.js            # Logging utility
│   │
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
│
├── tests/                        # Test files
│   ├── unit/                    # Unit tests
│   │   ├── auth.service.test.js
│   │   ├── products.service.test.js
│   │   └── orders.service.test.js
│   │
│   ├── integration/             # Integration tests
│   │   ├── auth.routes.test.js
│   │   ├── products.routes.test.js
│   │   └── orders.routes.test.js
│   │
│   ├── e2e/                     # End-to-end tests
│   │   └── user-journey.test.js
│   │
│   └── setup.js                 # Test setup
│
├── .github/                      # GitHub configuration
│   └── workflows/
│       └── ci.yml               # CI/CD pipeline
│
├── coverage/                     # Coverage reports
│
├── .env.example                  # Environment template
├── .env.test                     # Test environment
├── .eslintrc.json               # ESLint config
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies & scripts
├── postman_collection.json      # Postman API collection
│
├── README.md                     # Main documentation
├── TESTING.md                   # Testing guide
├── API.md                       # API reference
├── ARCHITECTURE.md              # This file
├── PROJECT_SUMMARY.md           # Project summary
└── QUICKSTART.md                # Quick start guide
```

## Design Patterns

### 1. **MVC Pattern** (Modified)
- **Model**: Service layer (business logic)
- **View**: JSON responses
- **Controller**: Request/response handling

### 2. **Repository Pattern**
- Services act as repositories
- Abstract data access
- In-memory storage (easily replaceable with DB)

### 3. **Middleware Pattern**
- Authentication middleware
- Error handling middleware
- Async wrapper middleware

### 4. **Factory Pattern**
- Error classes (AppError, ValidationError, etc.)
- Service instances

### 5. **Singleton Pattern**
- Service exports (single instance)
- Configuration module

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Network Layer                                           │
│     ├─► HTTPS (production)                                  │
│     ├─► CORS configuration                                  │
│     └─► Helmet (security headers)                           │
│                                                              │
│  2. Authentication Layer                                    │
│     ├─► JWT tokens                                          │
│     ├─► Token expiration                                    │
│     └─► Bearer token scheme                                 │
│                                                              │
│  3. Authorization Layer                                     │
│     ├─► Protected routes                                    │
│     ├─► User ownership checks                               │
│     └─► Role-based access (future)                          │
│                                                              │
│  4. Data Layer                                              │
│     ├─► Password hashing (bcrypt)                           │
│     ├─► Input validation                                    │
│     ├─► SQL injection prevention                            │
│     └─► XSS prevention                                      │
│                                                              │
│  5. Error Layer                                             │
│     ├─► No sensitive data in errors                         │
│     ├─► Generic error messages                              │
│     └─► Detailed logging (server-side)                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Current Architecture
- In-memory storage (development/testing)
- Single server instance
- Synchronous processing

### Production Enhancements
```
┌─────────────────────────────────────────────────────────────┐
│                  Production Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Load Balancer                                              │
│       │                                                      │
│       ├─► App Server 1 ──┐                                  │
│       ├─► App Server 2 ──┼─► Database (PostgreSQL/MongoDB)  │
│       └─► App Server N ──┘                                  │
│                │                                             │
│                └─────────► Redis Cache                       │
│                │                                             │
│                └─────────► Message Queue (RabbitMQ)          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Technology Stack                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Runtime                                                     │
│  └─► Node.js (16.x, 18.x, 20.x)                            │
│                                                              │
│  Framework                                                   │
│  └─► Express.js 4.x                                         │
│                                                              │
│  Authentication                                              │
│  ├─► jsonwebtoken (JWT)                                     │
│  └─► bcryptjs (password hashing)                            │
│                                                              │
│  Security                                                    │
│  ├─► helmet (security headers)                              │
│  ├─► cors (CORS handling)                                   │
│  └─► express-validator (input validation)                   │
│                                                              │
│  Testing                                                     │
│  ├─► Jest (test framework)                                  │
│  ├─► Supertest (HTTP testing)                               │
│  └─► cross-env (environment variables)                      │
│                                                              │
│  Development                                                 │
│  ├─► nodemon (auto-reload)                                  │
│  ├─► ESLint (linting)                                       │
│  └─► dotenv (environment config)                            │
│                                                              │
│  CI/CD                                                       │
│  └─► GitHub Actions                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Modular and maintainable code
- ✅ Comprehensive testing strategy
- ✅ Security best practices
- ✅ Scalable design
- ✅ Production-ready structure
