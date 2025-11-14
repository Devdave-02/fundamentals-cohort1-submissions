
-----

# 1\. Backend README (`devconnect-backend/README.md`)

````markdown
# DevConnect - Backend API 🚀

This repository contains the backend RESTful API for **DevConnect**, a lightweight developer collaboration platform. It is built with Node.js, Express, and MongoDB, and includes complete authentication and CRUD operations for projects and comments.

## Live Endpoints

* **Live API URL:** `https://your-backend-deployment-url.onrender.com` (Replace with your deployed URL)
* **Postman Documentation:** [https://documenter.getpostman.com/view/49371651/2sB3QQJTCT](https://documenter.getpostman.com/view/49371651/2sB3QQJTCT)

## Tech Stack

* **Runtime:** Node.js (via Bun)
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
* **Validation:** `express-validator`
* **Testing:** Jest & Supertest
* **Environment:** `dotenv`, `cors`

---

## Setup and Installation

### Prerequisites

* [Bun](https://bun.sh/)
* [Node.js](https://nodejs.org/) (v18+)
* [MongoDB](https://www.mongodb.com/) (local or a free Atlas cluster)

### 1. Clone the repository

```bash
git clone <your-backend-repo-url>
cd devconnect-backend
````

### 2\. Install dependencies

```bash
bun install
```

### 3\. Set up environment variables

Create a `.env` file in the root of the project and add the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4\. Run the application

To run the server in development mode (with hot-reloading):

```bash
bun dev
```

The API will be available at `http://localhost:5000`.

-----

## API Endpoints

All protected routes require a `Bearer <token>` in the `Authorization` header.

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Public/Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user. | Public |
| `POST` | `/api/auth/login` | Log in a user and return a JWT. | Public |
| `GET` | `/api/auth/me` | Get the profile of the logged-in user. | Protected |

### Projects (`/api/projects`)

| Method | Endpoint | Description | Public/Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Get a list of all projects. | Public |
| `POST` | `/api/projects` | Create a new project. | Protected |
| `GET` | `/api/projects/:id` | Get a single project by its ID. | Public |
| `PUT` | `/api/projects/:id` | Update a project (must be author). | Protected |
| `DELETE` | `/api/projects/:id` | Delete a project (must be author). | Protected |

### Comments (`/api/comments`)

| Method | Endpoint | Description | Public/Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/comments/project/:projectId` | Get all comments for a project. | Public |
| `POST` | `/api/comments` | Add a new comment to a project. | Protected |
| `DELETE` | `/api/comments/:id` | Delete a comment (must be author). | Protected |

-----

## Testing

This project uses **Jest** and **Supertest** for unit and integration testing.

To run the test suite:

```bash
bun test
```

### Test Results

All 3 unit tests for the authentication endpoints passed successfully, ensuring the signup and login logic is working correctly.

![alt text](<backend terminal.png>)

````

---
