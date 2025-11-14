
# FlowServe Backend API 🏦

This is the backend API for the **Software Engineering Week 6 Challenge**. It is a robust, scalable, and reliable Node.js application built to power the FlowServe fintech platform, focusing on processing real-time transactions and digital wallet operations.

This API is designed to handle increasing user loads while maintaining high availability and fault tolerance, following modern best practices in API design.
flowserve
**➡️ Frontend Repository:** [flowserve-frontend](https://github.com/martins0023/flowserve-frontend)

-----

## ✨ Features

  * **User Management:** Full CRUD operations for users.
  * **Transaction Simulation:** Secure and reliable endpoints for simulating fund transfers.
  * **Atomic Transactions:** Uses `prisma.$transaction` to ensure that fund transfers are "all-or-nothing," guaranteeing financial data integrity (ACID compliance).
  * **Scalable Architecture:** Modular project structure (services, controllers, routes) for easy maintenance.
  * **Robust Validation:** Request body, query, and param validation using **Zod** to ensure data integrity.
  * **High-Performance Logging:** Structured, asynchronous logging with **Pino** for production-grade monitoring.
  * **Security First:**
      * **Rate Limiting:** Protects against brute-force and DoS attacks using `express-rate-limit`.
      * **Security Headers:** `Helmet` middleware for protection against common web vulnerabilities.
      * **Password Hashing:** `bcryptjs` for secure user password storage.
  * **Error Handling:** A global error handling middleware to catch all operational errors and prevent crashes.
  * **Pagination:** Built-in support for paginating user lists.

-----

## 💻 Tech Stack

  * **Core:** Node.js, Express.js
  * **ORM:** Prisma
  * **Database:** PostgreSQL
  * **Validation:** Zod
  * **Logging:** Pino, Pino-Pretty (for development)
  * **Security:** Helmet, `express-rate-limit`
  * **Password Hashing:** `bcryptjs`
  * **Utilities:** `dotenv`, `cors`, `pino-http`

-----

## 🚀 Setup and Installation

Follow these steps to get the project running on your local machine.

### 1\. Prerequisites

  * Node.js (v18 or newer recommended)
  * `npm` or `yarn`
  * A running PostgreSQL database. You can get one for free from [Render](https://render.com/) or [Railway](https://railway.app/).

### 2\. Clone the Repository

```bash
git clone https://github.com/martins0023/flowserve-backend.git
cd flowserve-backend
```

### 3\. Install Dependencies

This project uses `npm` as its package manager.

```bash
npm install
```

### 4\. Set Up Environment Variables

1.  Create a new file in the root of the project named `.env`
2.  Copy the contents of the `.env.example` file (from the repository files) into your new `.env` file.
3.  Fill in the `DATABASE_URL` with your **PostgreSQL External Connection URL** (e.g., from Render).

**Important:** For cloud databases like Render, you **must** add `?sslmode=require` to the end of your connection string.

**Example `.env`:**

```env
# This is your database's external connection string
DATABASE_URL="postgresql://my_user:my_password@my_host.render.com/my_database?sslmode=require"

# Server port
PORT=8000
```

### 5\. Run Database Migrations

Prisma needs to sync your `schema.prisma` file with your database. This will create all the tables (`User`, `Transaction`, etc.).

```bash
npx prisma migrate dev --name "init"
```

### 6\. (Optional) Seed the Database

To add a few "dummy" users to your database for testing, you can run the seed script.

```bash
npx prisma db seed
```

*(This command is configured in `package.json` to run the `prisma/seed.js` file.)*

-----

## ▶️ Running the Application

Once setup is complete, you can run the server in development mode.

```bash
npm run dev
```

The server will start on the `PORT` specified in your `.env` file (e.g., `http://localhost:8000`) and will automatically restart on file changes.

-----

## 📖 API Documentation

The complete, importable Postman collection is included in the root of this repository:
`FlowServe.postman_collection.json`

You can import this file directly into Postman to have all endpoints and request bodies ready for testing.

### Quick Endpoint Guide

| Method | Endpoint | Description | Validation |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/users` | Creates a new user. | Yes (Zod) |
| `GET` | `/api/v1/users` | Gets a paginated list of all users. | `page`, `limit` (Zod) |
| `GET` | `/api/v1/users/:id` | Gets a single user by their ID. | `id` (Zod) |
| `POST` | `/api/v1/transactions/transfer` | Creates a new fund transfer. | Yes (Zod) |
| `GET` | `/api/v1/transactions/:userId`| Gets all transactions for a specific user. | `userId` (Zod) |
| `GET` | `/health` | A simple health check endpoint. | No |

-----

## 🗂️ Project Structure

The backend is structured in a modular way to separate concerns and improve maintainability.

```
flowserve-backend/
├── src/
│   ├── api/                # Route definitions (users.routes.js)
│   ├── config/             # Config files (db.js, logger.js)
│   ├── controllers/        # Request/Response handling (user.controller.js)
│   ├── middleware/         # Custom middleware (errorHandler.js, validate.js)
│   ├── services/           # Business logic (user.service.js)
│   ├── schemas/            # Zod validation schemas (user.schema.js)
│   ├── utils/              # Helper utilities (ApiError.js, asyncHandler.js)
│   ├── app.js              # Express app setup (middleware, routes)
│   └── server.js           # Server entry point
├── prisma/
│   ├── schema.prisma       # Prisma schema (database models)
│   └── seed.js             # Database seed script
├── .env                  # Environment variables
├── .gitignore
├── FlowServe.postman_collection.json
├── package.json
└── README.md
```