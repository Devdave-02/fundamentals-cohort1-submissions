#  Task Manager API & Frontend

A full-stack **Task Manager** application built with **Express.js**, **TypeScript**, **MongoDB**, and **Next.js**.  
This project allows authenticated users to create, manage, and track tasks with secure authentication using **JWT**, while implementing **OWASP A01 (Broken Access Control)** and **A03 (Injection)** mitigations.

---

##  Project Overview

The Task Manager is divided into two main parts:

1. **Backend (API)** – built with **Express.js + TypeScript + MongoDB**, handles authentication, task management, filtering, and searching.  
2. **Frontend (Next.js)** – handles user interaction, task views, and integration with the backend API.

---

##  Setup Instructions

###  Prerequisites
Make sure you have the following installed:
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)
- A `.env` file for both backend and frontend configurations.

---

##  Backend Setup (Express + TypeScript)

### 1. Clone the Repository
```bash
https://github.com/developedbyjay/task-manager-API
cd task-manager-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root of the backend folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/task-manager
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### 4. Build & Run the Server
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

> Server runs on: `http://localhost:5000`

---

##  Frontend Setup (Next.js)

### 1. Clone the Repository
```bash
https://github.com/developedbyjay/task-manager-FE


### 1. Navigate to Frontend Folder
```bash
cd ../task-manager-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Environment Variables
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Run the Development Server
```bash
npm run dev
```

> Frontend runs on: `http://localhost:3000`

---

##  JWT Authentication Flow

### 1. **User Login / Signup**
- User submits credentials (email, password).
- Backend validates credentials and issues:
  - **Access Token (short-lived)** → stored in memory (cookies and headers).
  - **Refresh Token (long-lived)** → stored securely in **HTTP-only cookie**.

### 2. **Access Token Usage**
- Each API request includes the **Bearer Access Token** in the Authorization header.
  ```http
  Authorization: Bearer <access_token>
  ```
- The backend validates the token using `JWT_ACCESS_SECRET`.

### 3. **Token Rotation Strategy**
To prevent token reuse attacks:
- When the access token expires, the frontend silently calls:
  ```
  POST /api/auth/refreshToken
  ```
- The backend verifies the refresh token (stored in cookie), issues a **new access token** and **rotates the refresh token** (generates a new one, invalidates the old one).

This ensures that if a refresh token is stolen, it can’t be reused once the rotation happens.

### 4. **Secure Token Storage**
| Token Type | Storage Location | Expiration | Purpose |
|-------------|------------------|-------------|----------|
| Access Token | In-memory (cookies and headers) | 15 minutes | Authorize API calls |
| Refresh Token | HTTP-only Secure Cookie | 7 days | Obtain new access token |

**Why this is secure:**
- Access tokens are never stored in `localStorage` or `sessionStorage` (reduces XSS risk).
- Refresh tokens use `HttpOnly` + `Secure` + `SameSite=Strict` cookies (reduces CSRF and theft risk).
- Rotation ensures limited exposure window.

---


---

##  OWASP Security Implementations

### 🔸 A01: Broken Access Control Mitigation
**Problem:** Attackers can access data or actions outside their privilege level.  
**Mitigations implemented:**
- **Role-based authorization middleware** ensures routes like `/api/tasks` are user-specific.
- Each user’s resources (e.g., tasks) are linked by `userId`, and queries always filter by it:
  ```ts
  const tasks = await Task.find({ user: req.user._id });
  ```
- Sensitive routes (admin, user management) are protected with `restrictTo('admin')`.
- Server rejects any attempt to modify another user’s resource.

### 🔸 A03: Injection Mitigation
**Problem:** Unsanitized input can lead to SQL/NoSQL injection.  
**Mitigations implemented:**
- Using **Mongoose ORM** with built-in query sanitization (prevents `$where` and operator injection).
- Validating all inputs using **Zod** (frontend) and custom validation on the backend.
- Rejecting unrecognized query parameters and enforcing strict schema validation:
  ```ts
  const validatedFilters = taskFilterSchema.parse(req.query);
  ```
- Avoiding dynamic query concatenation and parameterizing all queries.

---

##  API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|-----------|-------------|----------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refreshToken` | Refresh JWT tokens | Yes (via cookie) |
| POST | `/api/tasks` | Create a new task | Yes |
| GET | `/api/tasks` | Get all user tasks | Yes |
| POST | `/api/tasks/search` | Search user tasks | Yes |
| POST | `/api/tasks/filter` | Filter user tasks | Yes |


