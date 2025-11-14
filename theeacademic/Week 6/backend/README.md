# FlowServe Backend API

Express + Prisma + PostgreSQL backend for the FlowServe fintech challenge. It demonstrates scalable, modular API design with validation, logging, pagination, rate limiting, and robust error handling.

## Features

- Node.js + Express.js
- PostgreSQL with Prisma ORM
- Modular routes, controllers, and services
- Zod-based request validation (body, params, query)
- Centralized error handling with consistent JSON responses
- Pagination on list endpoints
- Pino logging (pretty in development)
- Global rate limiting with `express-rate-limit`
- CORS enabled
- Postman collection included: `FlowServe_API.postman_collection.json`

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or remote)

### 1) Configure environment

Copy `.env.example` to `.env` and adjust as needed:

```
cp .env.example .env
```

Required variables:

- `DATABASE_URL` – PostgreSQL connection string
- `PORT` – server port (default: 3000)
- `RATE_LIMIT_WINDOW_MS` – window in ms (default: 900000)
- `RATE_LIMIT_MAX` – max requests per window (default: 100)

### 2) Install dependencies

```
npm install
```

This will also run `prisma generate` to create the Prisma Client.

### 3) Run database migrations

Make sure your `DATABASE_URL` is set correctly in `.env`, then run:

```
npx prisma migrate dev --name init
```

This will create the database schema defined in `prisma/schema.prisma`.

Optionally, open Prisma Studio to inspect data:

```
npx prisma studio
```

### 4) Start the server

Development mode (auto-reload):

```
npm run dev
```

Production mode:

```
npm start
```

The API will be available at `http://localhost:3000/api` and health check at `http://localhost:3000/health`.

## API Overview

Base URL: `http://localhost:3000/api`

### Users

- `GET /users` – List users with pagination
	- Query: `page`, `limit`, `search`
- `GET /users/:id` – Get user by ID
- `POST /users` – Create user
	- Body: `{ name: string, email: string }`
- `PUT /users/:id` – Update user
	- Body: `{ name?: string, email?: string }`
- `DELETE /users/:id` – Delete user

### Transactions

- `GET /transactions` – List transactions with pagination
	- Query: `page`, `limit`, `userId?`
- `GET /transactions/:id` – Get transaction by ID
- `POST /transactions` – Create (simulate) transaction
	- Body: `{ userId: uuid, type: 'CREDIT'|'DEBIT', amount: '100.00', description?: string }`
	- Debits validate sufficient funds and adjust user balance atomically.
- `PUT /transactions/:id` – Update transaction (description only)
- `DELETE /transactions/:id` – Delete transaction and reverse its balance effect

### Response format

All responses use a consistent shape:

```
{ "success": boolean, "data"?: any, "pagination"?: {...}, "message"?: string, "details"?: any }
```

Pagination responses include `{ page, limit, total, totalPages }`.

### Validation and errors

- Zod validates all inputs; validation errors return 400 with details
- Not found returns 404
- Rate limiting returns 429
- Server errors return 500 with a generic message

## Project structure

```
src/
	config/       # env, logger, prisma, rate limit
	controllers/  # request handlers (thin)
	services/     # business logic (Prisma)
	validators/   # Zod schemas
	middleware/   # error handler, validation
	routes/       # express routers
	app.js        # express app
	server.js     # server bootstrap
prisma/
	schema.prisma
```

## Postman Collection

Import `FlowServe_API.postman_collection.json` into Postman to try all endpoints. The collection is configured with a `baseUrl` variable defaulting to `http://localhost:3000/api`.

## Notes

- Prisma Client is generated on `npm install` via the `postinstall` script.
- The server connects to the database lazily on the first Prisma query, so it can start even if the DB is temporarily offline.
