# E-commerce Checkout System (Microservices Architecture)

This repository contains a proposed **microservices-based architecture** for an e-commerce checkout system.  
It includes **backend services** (Node.js + Express + MongoDB) and a **frontend client** (Next.js).

---

## 1. Current Monolithic Checkout Flow

In the **monolithic system**, all checkout functionality exists in a single codebase and database:

1. **User Authentication** → Validates login/session.
2. **Cart Management** → Manages items in user’s cart.
3. **Payment Processing** → Handles payment gateway logic.
4. **Order Creation & Confirmation** → Creates order, updates inventory, confirms transaction.
5. **Notification** → Sends email/SMS confirmation.

### Limitations

- Hard to **scale** services independently.
- A bug in one module can **crash the entire system**.
- **Slower deployments** due to tightly coupled components.

---

## 2. Proposed Microservices Architecture

Each service is **independent** with its **own database**, enabling scaling and safer deployments.  
They communicate via **REST/gRPC** and **event-driven messaging**.

### **Services Overview**

- **Authentication Service** → Manages users, login, JWT tokens.
- **Cart Service** → Handles cart items, quantities, product references.
- **Payment Service** → Processes payments via third-party gateways (Stripe, Paystack, etc.).
- **Order Service** → Creates and manages orders after successful payment.
- **Inventory Service** → Updates product stock levels after purchase.
- **Notification Service** → Sends email/SMS confirmations.
- **API Gateway** → Entry point for all client requests (routes + auth).
- **Message Broker** (Kafka/RabbitMQ/EventBus) → Enables asynchronous event-driven workflows.

---

## 3. High-Level Architecture Diagram

// MY IMAGE WILL GO HERE

# REPOSITORIES

## Backend ---> https://github.com/developedbyjay/BE-Cartservice.git

## Frontend ---> https://github.com/developedbyjay/FE-Cartservice.git

---

## Getting Started - Backend Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v10.11.1 or higher)
- **MongoDB** (Cloud or local instance)

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/developedbyjay/BE-Cartservice.git
   cd BE-Cartservice
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Configuration**

   The project uses an environment file located at `src/.env`. Current configuration:

   ```properties
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongo_url
   WHITELIST_ORIGINS=["http://localhost:3000", "http://localhost:3001"]
   ACCESS_TOKEN_EXPIRES=1hr
   JWT_ACCESS_SECRET=your_secret
   ```

   **Note:** Make sure to update the `MONGO_URI` , `JWT_ACCESS_SECRET` and `WHITELIST_ORIGINS` for production use.

### Running the Service

#### Development Mode (with hot reload)

```bash
pnpm dev
```

This command:

- Uses `tsx watch` for TypeScript execution with hot reload
- Automatically loads environment variables from `src/.env`
- Restarts the server when files change

## Getting Started - Frontend Setup

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/developedbyjay/FE-Cartservice.git
   cd FE-Cartservice
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Configure the environment variables:

   ```env
   LOCAL_BACKEND_URL=http://localhost:5000/v1
   API_TIMEOUT=10000
   ```

## Getting Started

### Development Mode

Start the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## API Endpoints Documentation

This cart service provides a comprehensive REST API for e-commerce cart functionality. All endpoints are versioned under `/v1` and most require JWT authentication.

### Authentication Endpoints (`/v1/auth`)

#### **POST `/v1/auth/register`**

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Validation Rules:**

- `name`: Required, non-empty string
- `email`: Valid email format, must be unique
- `password`: Minimum 8 characters

**Response:** User data and JWT token

---

#### **POST `/v1/auth/login`**

Authenticate existing user and get access token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Validation Rules:**

- `email`: Required, must exist in database
- `password`: Required, must match stored password

**Response:** JWT token for session management

---

#### **DELETE `/v1/auth/logout`**

Log out the current authenticated user.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response:** Success confirmation

---

### User Management (`/v1/user`)

#### **GET `/v1/user/current-user`**

Get current authenticated user's profile information.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response:** User profile details (name, email, timestamps)

---

### Shopping Cart (`/v1/cart`)

#### **POST `/v1/cart/add-to-cart`**

Add products to the user's shopping cart.

**Headers:** `Authorization: Bearer <jwt_token>`

**Request Body:**

```json
{
  "productId": "64a7b8c9d1234567890abcde",
  "quantity": 2
}
```

**Validation Rules:**

- `productId`: Required, valid MongoDB ObjectId
- `quantity`: Required, positive integer

**Response:** Updated cart information

---

#### **GET `/v1/cart/get-cart/:userId`**

Retrieve all items in a specific user's cart.

**Headers:** `Authorization: Bearer <jwt_token>`

**URL Parameters:**

- `userId`: MongoDB ObjectId of the user

**Response:** Complete cart contents with populated product details

---

#### **GET `/v1/cart/get-cart-item-length/:userId`**

Get the total number of items in user's cart.

**Headers:** `Authorization: Bearer <jwt_token>`

**URL Parameters:**

- `userId`: MongoDB ObjectId of the user

**Response:** Total item count (useful for cart badges in UI)

---

### Product Management (`/v1/products`)

#### **POST `/v1/products/create_product`**

Create new products in the system.

**Headers:** `Authorization: Bearer <jwt_token>`

**Request Body:**

```json
{
  "name": "Premium Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": 199.99,
  "image": "https://example.com/headphones.jpg"
}
```

**Validation Rules:**

- `name`: Required, non-empty string
- `description`: Required, non-empty string
- `price`: Required, number greater than 0
- `image`: Optional, valid URL format

**Response:** Created product details

---

#### **GET `/v1/products/get-all-products`**

Retrieve all available products from the catalog.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response:** Array of all products with complete details
