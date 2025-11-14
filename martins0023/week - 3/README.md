# Secure, Token-Based Node.js API with RBAC

This repository contains the backend for the Secure Task Management Platform. It is a Node.js/Express API that implements a robust JSON Web Token (JWT) authentication and authorization system with Role-Based Access Control (RBAC) to support 'user' and 'admin' roles. The primary focus is on security, mitigating critical OWASP Top 10 vulnerabilities like Broken Access Control (A01) and Injection (A03).

## Features

-   **User Authentication**: Secure registration and login with password hashing (`bcryptjs`).
-   **JWT Authentication**: Uses a short-lived Access Token and a long-lived Refresh Token.
-   **Secure Token Handling**: Tokens are stored in secure, `HttpOnly` cookies to prevent XSS.
-   **Role-Based Access Control (RBAC)**: Middleware protects routes based on user roles (`user`, `admin`).
-   **Account Lockout**: Locks user accounts for 30 minutes after 3 failed login attempts.
-   **Refresh Token Revocation**: A token blacklist prevents reuse of refresh tokens after logout.
-   **Secure Headers**: `helmet` is used to set various security-related HTTP headers.
-   **Custom Input Validation**: Mitigates injection attacks through manual input validation and sanitization.
-   **Task Management**: CRUD-like operations for tasks.
-   **Advanced Queries**: Paginated search and filter endpoints for tasks.

---

## Setup and Running Instructions

### Prerequisites

-   Node.js (v18 or higher)
-   npm
-   MongoDB (local instance or a cloud service like MongoDB Atlas)

### 1. Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/martins0023/secure-task-manager.git
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a file named `.env` in the root of the backend directory and copy the contents from `.env.example` (or the provided `.env` structure). **Crucially, change the `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` to long, random, and unguessable strings.**

    ```env
    # Server Configuration
    PORT=5001
    NODE_ENV=development

    # MongoDB Connection (update with your connection string)
    MONGO_URI=mongodb://127.0.0.1:27017/secure_task_db

    # JWT Secrets (CHANGE THESE!)
    ACCESS_TOKEN_SECRET=replace_with_a_very_long_random_string
    REFRESH_TOKEN_SECRET=replace_with_another_very_long_random_string
    ACCESS_TOKEN_EXPIRATION=15m
    REFRESH_TOKEN_EXPIRATION=7d

    # Account Lockout
    MAX_LOGIN_ATTEMPTS=3
    LOCKOUT_DURATION_MINUTES=30
    ```

4.  **Start the server:**
    ```bash
    # For development with auto-reloading
    npm run dev

    # For production
    npm start
    ```
    The API will be running on `http://localhost:5001`.

### 2. Frontend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/martins0023/secure-task-manager.git
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The React application will be running on `http://localhost:5173`.

---

## Technical Explanation & Security Measures

### JWT Flow and Secure Token Storage

This application employs a robust token-based authentication flow to ensure security and a good user experience.

1.  **Login**: A user provides their credentials. The server verifies them and, if successful, generates two tokens:
    * **Access Token**: A short-lived JWT (15 minutes) containing the user's ID and role.
    * **Refresh Token**: A long-lived JWT (7 days) containing only the user's ID.

2.  **Secure Storage (HttpOnly Cookies)**: Instead of sending the tokens in the response body for the client to store in `localStorage` (which is vulnerable to XSS attacks), the server sets them in **`HttpOnly`, `Secure`, `SameSite=Strict` cookies**.
    * **`HttpOnly`**: Prevents JavaScript running on the client from accessing the cookies. This is the single most important defense against token theft via XSS.
    * **`Secure`**: Ensures the cookies are only sent over HTTPS in production.
    * **`SameSite=Strict`**: Protects against CSRF attacks by ensuring the cookie is only sent for requests originating from the same site.

3.  **Authenticated Requests**: The browser automatically attaches the `accessToken` cookie to every subsequent request to the API. The `protect` middleware on the backend verifies this token.

4.  **Token Refresh**: When the Access Token expires, the API returns a `401 Unauthorized` status. A client-side `axios` interceptor catches this response and automatically sends a request to the `/api/auth/refresh-token` endpoint. The browser attaches the `refreshToken` cookie to this request. The server validates the refresh token, issues a *new* access token (via a new `HttpOnly` cookie), and the original failed request is retried seamlessly.

5.  **Logout**: When a user logs out, the `refreshToken` is added to a blacklist in the database, and the cookies are cleared. This prevents the token from being used to generate new access tokens, effectively revoking the session.


### Project Structure
```
secure-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Task.js
│   │   ├── Token.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosConfig.js
│   │   ├── components/
│   │   │   ├── CreateTaskForm.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── TaskList.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

### Mitigation of OWASP Vulnerabilities

#### A01:2021 - Broken Access Control

Broken Access Control is mitigated through a multi-layered approach:

1.  **Authentication Middleware (`protect`)**: Every protected route first passes through this middleware, which validates the `accessToken`. If the token is invalid or missing, access is denied immediately with a `401` status.

2.  **Authorization Middleware (`authorize`)**: After authentication, this middleware checks the user's role (e.g., `'user'`, `'admin'`), which was extracted from the JWT payload. It compares the user's role against a list of allowed roles for that specific endpoint.
    * **Example**: The `DELETE /api/tasks/:id` route is protected by `authorize('admin')`. If a user with the `'user'` role attempts to access this endpoint, the middleware will immediately reject the request with a `403 Forbidden` status, even if their authentication token is valid.

3.  **Data Access Logic**: Business logic within controllers is role-aware. For instance, when fetching tasks via `GET /api/tasks`, the controller checks `req.user.role`. If the role is `'user'`, the database query is explicitly filtered to return *only* the tasks belonging to that user's ID (`{ user: req.user.id }`). Admins do not have this filter applied, allowing them to see all tasks.

4.  **Client-Side UI Controls**: The frontend conditionally renders UI elements. The "Delete" button for tasks is only rendered if the authenticated user's role is `'admin'`. While this improves user experience, it is **not a security measure**. The backend RBAC middleware provides the actual security enforcement.

#### A03:2021 - Injection

Injection vulnerabilities are primarily prevented through strict input validation and sanitization, without relying on external validation libraries.

1.  **Custom Input Validation**: Before any data is processed or saved, it passes through custom validator functions in `backend/utils/validators.js`.
    * `isValidEmail()` uses a regular expression to ensure the email format is correct.
    * `isValidUsername()` and `isValidPassword()` use regex to enforce rules on length and character sets.
    * Task titles and other string inputs are checked for presence and minimum length.
    * If any validation fails, the request is rejected with a `400 Bad Request` status and a descriptive error message, preventing malformed or malicious data from reaching the database driver.

2.  **Data Sanitization**:
    * All string inputs are sanitized using a `sanitizeString()` function that trims whitespace. In a more complex application, this would also include escaping characters like `<`, `>`, `&` to prevent XSS if the data were ever rendered as raw HTML.
    * **Mongoose for NoSQL Injection Prevention**: We leverage Mongoose, an Object Data Modeling (ODM) library. Mongoose models have predefined schemas (`User.js`, `Task.js`). When we use methods like `User.create()` or `Task.find()`, Mongoose sanitizes the inputs against the schema types. This prevents NoSQL injection attacks where an attacker might try to inject query operators (like `$gt`, `$ne`) into the database query. All user-supplied data is passed as values, not as parts of the query structure itself.

3.  **Secure Headers**: The `helmet` middleware is used to set security headers like `Content-Security-Policy` and `X-XSS-Protection`, which provide an additional layer of defense against XSS and other injection-style attacks in the browser.