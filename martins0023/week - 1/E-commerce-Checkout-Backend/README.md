## E‑commerce Checkout System — Cart Service (Proposal + PoC)

What this document contains

  * System analysis of the current monolith checkout flow
  * Proposed microservices architecture (diagram + descriptions)
  * Proof-of-concept implementation: cart-service (Node.js + Express + MongoDB)
    - Auth endpoints (register/login) using JWT
    - Cart endpoints: POST /add-to-cart, GET /get-cart/:userId
  * Frontend PoC (React + Vite) that talks to the cart-service
  * Setup and run instructions (local + MongoDB Atlas)

1) System Analysis (monolith)
In a traditional monolithic architecture, all of the checkout functionalities are tightly coupled and run within a single application. This means a single codebase handles everything from the user's initial interaction to the final order confirmation.

Typical monolithic checkout process often bundles the following responsibilities in a single app:

  * User Authentication & Authorization: Validating a user's identity and handling their session.
  * Product Catalog (product metadata)
  * Cart Management (temporary cart state): Storing, adding, and removing items from a user's shopping cart.
  * Pricing & Promotions
  * Inventory (stock checks): Decrementing product stock once an order is placed.
  * Payment Processing: Integrating with a payment gateway to securely process transactions.
  * Order Creation / Fulfilment: Generating an order, sending confirmation emails, and updating inventory.
  * Notifications (email/sms)
  * Problems encountered as scale increases:
  * Tight coupling — changing one responsibility risks others
  * Harder to scale by workload (e.g., payment spikes vs browse spikes)
  * Teams stepping over each other in the same codebase
  * Hard to evolve or adopt new technologies for just one piece

2) Proposed microservices architecture
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │────│  Load Balancer  │────│   Web Client    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ├─────────────────────────────────────────────────────────┐
         │                                                         │
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Auth Service   │  │  Cart Service   │  │Product Service  │  │ Payment Service │
│                 │  │                 │  │                 │  │                 │
│ - Login         │  │ - Add to cart   │  │ - Get products  │  │ - Process       │
│ - Register      │  │ - Get cart      │  │ - Search        │  │ - Validate      │
│ - JWT tokens    │  │ - Update qty    │  │ - Inventory     │  │ - Refund        │
│ - Validation    │  │ - Remove items  │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
         │                       │                   │                       │
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   User DB       │  │   Cart DB       │  │  Product DB     │  │  Payment DB     │
│  (MongoDB)      │  │  (MongoDB)      │  │  (MongoDB)      │  │  (MongoDB)      │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Order Service  │  │Notification Svc │  │ Inventory Svc   │
│                 │  │                 │  │                 │
│ - Create order  │  │ - Email alerts  │  │ - Stock check   │
│ - Track status  │  │ - SMS notifs    │  │ - Update stock  │
│ - Order history │  │ - Push notifs   │  │ - Reservations  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                       │                   │
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Order DB      │  │   Message Queue │  │ Inventory DB    │
│  (MongoDB)      │  │    (Redis)      │  │  (MongoDB)      │
└─────────────────┘  └─────────────────┘  └─────────────────┘

A microservices architecture breaks down the monolith into a set of small, independent services, each running in its own process and communicating with others via lightweight mechanisms, typically an API. Here's a breakdown for a checkout system:

Service Breakdown
  * i. Auth Service
  Purpose: Handle user authentication and authorization
  Data: User credentials, JWT tokens, user profiles
  Endpoints: /login, /register, /validate-token

  * ii. Cart Service (Implementation Focus)
  Purpose: Manage shopping cart operations
  Data: Cart items, quantities, user associations
  Endpoints: /add-to-cart, /get-cart/:userId, /update-cart, /clear-cart

  * iii. Product Service
  Purpose: Manage product catalog and information
  Data: Product details, pricing, categories, images
  Endpoints: /products, /products/:id, /search

  * iv. Payment Service
  Purpose: Process payments and handle transactions
  Data: Payment methods, transaction history, receipts
  Endpoints: /process-payment, /validate-payment

  * v. Order Service
  Purpose: Create and manage orders
  Data: Order details, status, shipping information
  Endpoints: /create-order, /orders/:userId, /order-status/:orderId

  * vi. Notification Service
  Purpose: Send notifications to users
  Data: Notification templates, delivery logs
  Endpoints: /send-email, /send-sms

  * vii. Inventory Service
  Purpose: Manage stock levels and availability
  Data: Stock quantities, reservations, suppliers
  Endpoints: /check-stock, /update-inventory, /reserve-items

* Communication patterns
 - Synchronous HTTP for request/response (e.g., cart -> product for price snapshots)
 - Asynchronous messaging (Kafka/RabbitMQ) for eventual consistency (e.g., order created -> inventory reservation -> payment -> notification)

* Security
 - auth-service issues JWTs; services validate tokens for protected endpoints.
 - Internal service-to-service calls should use mTLS or signed tokens / service tokens in production.


## 🛠️ Implementation Details

3) Proof-of-concept implementation
This PoC implements a minimal cart-service with the following endpoints:
**Auth** (basic, to enable protected cart actions in the PoC)
* User registration with email and password
* User login with JWT token generation
  - POST /auth/register — register a user (email + password)
  - POST /auth/login — login, returns JWT

**Cart**
* Add items to cart with automatic total calculation
* Retrieve user's cart with all items
* Update item quantities
* Remove specific items
* Clear entire cart
  - POST /add-to-cart — body { userId, productId, qty } (protected)
  - GET /get-cart/:userId — retrieve cart for userId (protected)

**Technical Stack**
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT (JSON Web Tokens)
- Frontend: React, Vite, Axios
- Database: MongoDB (Local or Atlas)

## 📦 Prerequisites
Before running this project, make sure you have:

Node.js (v22 or higher)
MongoDB (local installation)
Git
npm or yarn package manager

## 🚀 Local Setup
1. Clone the Repository
    *bash*
    ```
    git clone <your-backend-repository-url>
    cd E-commerce Checkout Backend
    ```

2. Install Dependencies
    *bash*
    ```
    npm install
    ```

3. Environment Configuration
* Create a .env file in the root directory:

    *bash*
    ```
    # Server Configuration
    PORT=3001
    NODE_ENV=development

    # Database Configuration
    MONGODB_URI=mongodb://localhost:27017/ecommerce_cart

    # JWT Configuration
    JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
    JWT_EXPIRES_IN=7d

    # Frontend Configuration
    FRONTEND_URL=http://localhost:5173

    # CORS Configuration
    ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
    ```

4. Run the Backend
*bash*
# Development mode (with auto-restart)
    ```
    npm run dev
    ```

# Production mode
    ```
    npm start
    ```
    The server will start on http://localhost:3001

5. Verify Installation
* Test the health endpoint:

*bash*
    ```
    curl http://localhost:3001/health
    ```

Expected response:
json{
  "status": "Cart Service is running!",
  "timestamp": "2024-01-XX...",
  "database": "connected"
}

## ☁️ MongoDB Atlas Setup
If you prefer using MongoDB Atlas (cloud database):
1. Create Atlas Account

Go to MongoDB Atlas
Create a free account and cluster

2. Get Connection String

In Atlas dashboard, click "Connect"
Choose "Connect your application"
Copy the connection string

3. Update Environment Variables
bash
# Replace the MONGODB_URI in your .env file
    ```
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerce_cart?retryWrites=true&w=majority
    ```

4. Configure Network Access

In Atlas, go to "Network Access"
Add your IP address or use 0.0.0.0/0 for development

📚 API Documentation
Authentication Endpoints

**Cart Endpoints (Protected)**
All cart endpoints require authentication. Include the JWT token in the Authorization header:
    ```
    Authorization: Bearer <your_jwt_token>
    ```

**POST /cart/add-to-cart**
Add an item to the user's cart.
*Request:*
```
json{
  "productId": "product_123",
  "productName": "Wireless Headphones",
  "price": 99.99,
  "quantity": 2,
  "image": "https://example.com/image.jpg"
}
```

*Response:*
```
json{
  "message": "Item added to cart",
  "cart": {
    "_id": "cart_id",
    "userId": "user_id",
    "items": [
      {
        "productId": "product_123",
        "productName": "Wireless Headphones",
        "price": 99.99,
        "quantity": 2,
        "image": "https://example.com/image.jpg"
      }
    ],
    "totalAmount": 199.98,
    "createdAt": "2024-01-XX...",
    "updatedAt": "2024-01-XX..."
  }
}
```

**GET /cart/get-cart/:userId**
Retrieve the user's cart.

*Response:*
```
json{
  "_id": "cart_id",
  "userId": "user_id",
  "items": [
    {
      "productId": "product_123",
      "productName": "Wireless Headphones",
      "price": 99.99,
      "quantity": 2,
      "image": "https://example.com/image.jpg"
    }
  ],
  "totalAmount": 199.98,
  "createdAt": "2024-01-XX...",
  "updatedAt": "2024-01-XX..."
}
```

**PUT /cart/update-item**
Update item quantity in cart.

*Request:*
```
json{
  "productId": "product_123",
  "quantity": 3
}
```

**DELETE /cart/remove-item**
Remove an item from cart.

*Request:*
```
json{
  "productId": "product_123"
}
```

**DELETE /cart/clear**
Clear all items from the user's cart.

Response:
```
json{
  "message": "Cart cleared successfully"
}
```

## 📁 Project Structure
E-commerce-Checkout-Backend/
├── src/
│   ├── controllers/
│   │   └── cartController.js      # Cart management logic
│   ├── models/
│   │   └── Cart.js               # Cart data model
│   ├── routes/
│   │   └── cartRoutes.js         # Cart routes
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   ├── config/
│   │   └── database.js           # Database connection setup
│   └── app.js                    # Main application file
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── package-lock.json           # Dependency lock file
└── README.md                   # This documentation

## 🎨 Frontend Repository
The React frontend application is available at: <a href="">Frontend Repository Link</a>
Frontend Features:
- Product catalog display
- Add to cart functionality
- Cart management (view, update, remove items)
- User authentication (login/register)
- Responsive design
- Real-time cart updates

Frontend Setup:
*bash*
# Clone frontend repository
    ```
    git clone <frontend-repository-url>
    cd cart-frontend
    ```

# Install dependencies
    ```
    npm install
    ```

# Start development server
    ```
    npm run dev
    ```
The frontend will be available at http://localhost:5173