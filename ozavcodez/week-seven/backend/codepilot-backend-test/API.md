# API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Health Check

#### Check Server Health
```http
GET /health
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Auth Module

### Register User

Create a new user account.

```http
POST /api/auth/register
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

**Errors**:
- `400 Bad Request` - Missing or invalid fields
- `409 Conflict` - Email already exists

---

### Login User

Authenticate and receive a JWT token.

```http
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

**Errors**:
- `400 Bad Request` - Missing credentials
- `401 Unauthorized` - Invalid credentials

---

### Get Current User

Get the authenticated user's information.

```http
GET /api/auth/me
```

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors**:
- `401 Unauthorized` - Missing or invalid token

---

## Products Module

### Create Product

Create a new product (requires authentication).

```http
POST /api/products
```

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "name": "MacBook Pro",
  "description": "16-inch, M2 Pro chip",
  "price": 2499.99,
  "stock": 10,
  "category": "electronics"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "MacBook Pro",
    "description": "16-inch, M2 Pro chip",
    "price": 2499.99,
    "stock": 10,
    "category": "electronics",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors**:
- `400 Bad Request` - Invalid product data
- `401 Unauthorized` - Missing or invalid token

---

### Get All Products

Get all products with optional filtering.

```http
GET /api/products
```

**Query Parameters**:
- `category` (optional) - Filter by category
- `minPrice` (optional) - Minimum price filter
- `maxPrice` (optional) - Maximum price filter
- `inStock` (optional) - Filter available products (true/false)

**Examples**:
```http
GET /api/products
GET /api/products?category=electronics
GET /api/products?minPrice=100&maxPrice=1000
GET /api/products?inStock=true
GET /api/products?category=electronics&minPrice=500&inStock=true
```

**Response**: `200 OK`
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "uuid-1",
      "name": "MacBook Pro",
      "description": "16-inch, M2 Pro chip",
      "price": 2499.99,
      "stock": 10,
      "category": "electronics",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "name": "Magic Mouse",
      "description": "Wireless mouse",
      "price": 79.99,
      "stock": 15,
      "category": "electronics",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Product by ID

Get a specific product by its ID.

```http
GET /api/products/:id
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "MacBook Pro",
    "description": "16-inch, M2 Pro chip",
    "price": 2499.99,
    "stock": 10,
    "category": "electronics",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors**:
- `404 Not Found` - Product not found

---

### Update Product

Update an existing product (requires authentication).

```http
PUT /api/products/:id
```

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body** (all fields optional):
```json
{
  "name": "MacBook Pro (Updated)",
  "description": "New description",
  "price": 2299.99,
  "stock": 15,
  "category": "electronics"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "MacBook Pro (Updated)",
    "description": "New description",
    "price": 2299.99,
    "stock": 15,
    "category": "electronics",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Errors**:
- `400 Bad Request` - Invalid update data
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Product not found

---

### Delete Product

Delete a product (requires authentication).

```http
DELETE /api/products/:id
```

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "MacBook Pro",
    "description": "16-inch, M2 Pro chip",
    "price": 2499.99,
    "stock": 10,
    "category": "electronics",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors**:
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Product not found

---

## Orders Module

All order endpoints require authentication.

### Create Order

Create a new order.

```http
POST /api/orders
```

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "items": [
    {
      "productId": "product-uuid-1",
      "quantity": 2
    },
    {
      "productId": "product-uuid-2",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94102"
  }
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "userId": "user-uuid",
    "items": [
      {
        "productId": "product-uuid-1",
        "productName": "MacBook Pro",
        "quantity": 2,
        "price": 2499.99,
        "subtotal": 4999.98
      },
      {
        "productId": "product-uuid-2",
        "productName": "Magic Mouse",
        "quantity": 1,
        "price": 79.99,
        "subtotal": 79.99
      }
    ],
    "total": 5079.97,
    "status": "pending",
    "shippingAddress": {
      "street": "123 Main Street",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94102"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors**:
- `400 Bad Request` - Invalid order data or insufficient stock
- `401 Unauthorized` - Missing or invalid token

---

### Get All Orders

Get all orders for the authenticated user.

```http
GET /api/orders
```

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional) - Filter by order status
  - Values: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

**Examples**:
```http
GET /api/orders
GET /api/orders?status=pending
GET /api/orders?status=delivered
```

**Response**: `200 OK`
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "order-uuid-1",
      "userId": "user-uuid",
      "items": [...],
      "total": 5079.97,
      "status": "pending",
      "shippingAddress": {...},
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "order-uuid-2",
      "userId": "user-uuid",
      "items": [...],
      "total": 1299.99,
      "status": "delivered",
      "shippingAddress": {...},
      "createdAt": "2024-01-02T00:00:00.000Z",
      "updatedAt": "2024-01-05T00:00:00.000Z"
    }
  ]
}
```

**Errors**:
- `401 Unauthorized` - Missing or invalid token

---

### Get Order by ID

Get a specific order by its ID.

```http
GET /api/orders/:id
```

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "userId": "user-uuid",
    "items": [
      {
        "productId": "product-uuid",
        "productName": "MacBook Pro",
        "quantity": 2,
        "price": 2499.99,
        "subtotal": 4999.98
      }
    ],
    "total": 4999.98,
    "status": "pending",
    "shippingAddress": {
      "street": "123 Main Street",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94102"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors**:
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Order belongs to another user
- `404 Not Found` - Order not found

---

### Update Order Status

Update the status of an order.

```http
PATCH /api/orders/:id/status
```

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "status": "processing"
}
```

**Valid Status Values**:
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled` (use cancel endpoint instead)

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "userId": "user-uuid",
    "items": [...],
    "total": 4999.98,
    "status": "processing",
    "shippingAddress": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Errors**:
- `400 Bad Request` - Invalid status or cannot update cancelled order
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Order not found

---

### Cancel Order

Cancel an order and restore product stock.

```http
POST /api/orders/:id/cancel
```

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "userId": "user-uuid",
    "items": [...],
    "total": 4999.98,
    "status": "cancelled",
    "shippingAddress": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Notes**:
- Only orders with status `pending` or `processing` can be cancelled
- Product stock is automatically restored upon cancellation

**Errors**:
- `400 Bad Request` - Order cannot be cancelled (already shipped/delivered)
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Order belongs to another user
- `404 Not Found` - Order not found

---

### Get Order Statistics

Get order statistics for the authenticated user.

```http
GET /api/orders/stats
```

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 10,
    "pending": 2,
    "processing": 3,
    "shipped": 1,
    "delivered": 3,
    "cancelled": 1,
    "totalRevenue": 15299.94
  }
}
```

**Notes**:
- `totalRevenue` excludes cancelled orders

**Errors**:
- `401 Unauthorized` - Missing or invalid token

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

## Rate Limiting

Currently, there is no rate limiting implemented. In production, consider implementing rate limiting to prevent abuse.

## Postman Collection

Import the `postman_collection.json` file into Postman for a complete interactive API reference with:
- Pre-configured requests
- Environment variables
- Automatic token management
- Example requests and responses

## Examples

### Complete User Flow

1. **Register**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"John"}'
```

2. **Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

3. **Create Product**:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":999.99,"stock":10}'
```

4. **Create Order**:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"PRODUCT_ID","quantity":1}],"shippingAddress":{"street":"123 Main","city":"NYC"}}'
```

## Support

For issues or questions about the API, please refer to the main README.md or open an issue in the repository.
