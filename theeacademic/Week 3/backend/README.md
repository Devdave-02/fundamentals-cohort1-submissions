# brave-week3backend
Secure Multi-Role API Development

## Overview

This repository contains a Node.js + Express backend implementing a secure task management API with JWT authentication, refresh tokens, account lockout, and role-based access control (RBAC). The frontend (React-Vite) should be run from the separate frontend repo.

## Quick start

1. Copy `.env.example` to `.env` and set values (ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET strongly recommended).
2. Install dependencies:

```bash
npm install
```

3. Start local MongoDB, then run:

```bash
npm run dev
```

API will run on the port in `.env` (default 4000).

## JWT flow and token strategy

- On successful login the server issues a short-lived Access Token (default 15 minutes) and a longer-lived Refresh Token (default 7 days).
- Access Token is returned in the JSON response and should be stored in client memory (not localStorage) to avoid XSS risks.
- Refresh Token is sent as an HttpOnly cookie by the server. This prevents JavaScript access to the refresh token and reduces XSS attack surface.
- The `POST /api/auth/refresh` endpoint reads the refresh token from the cookie, validates it against the stored tokens in the database and issues a new Access Token. Refresh tokens are stored in the user document and can be revoked on logout.

Token rotation: this implementation keeps refresh tokens server-side and validates them on refresh; on logout the refresh token is removed from the user's stored list.

## How Broken Access Control (A01) is mitigated

- RBAC middleware (`src/middleware/auth.js`) enforces role checks on all protected routes.
- The `DELETE /api/tasks/:id` route is restricted to `admin` role only. Even if a non-admin crafts a request, the backend will reject it.
- For user-scoped endpoints (`GET /api/tasks`, `search`, `filter`) users with role `user` are filtered to only return tasks where `owner` matches the user's id. Admins can access all tasks.

## How Injection (A03) is mitigated

- Custom input validation and sanitization functions live in `src/utils/validation.js` and are used on registration and task creation endpoints. No external validation libraries are used, per the requirements.
- User-supplied strings are sanitized to strip control characters and trimmed. Search inputs are escaped before building regular expressions to avoid regex injection.
- All database queries are performed via Mongoose which uses parameterized queries, preventing classic injection vectors for MongoDB.

## Account lockout

- After 3 failed login attempts the account is locked for 30 minutes. Successful login resets the counter.

## Refresh token blacklist / revocation

- Refresh tokens are stored in the user's `refreshTokens` array. On logout the refresh token is removed, preventing reuse. The refresh endpoint checks that the presented refresh token exists in the user's stored tokens.

## Next steps / Frontend notes

- The frontend should store the Access Token in memory (e.g., React state) and refresh it via the `/api/auth/refresh` endpoint which relies on the HttpOnly refresh cookie. The frontend code for this project lives in the separate repository at the workspace root `brave-week3frontend/`.

Note: There was a minimal frontend scaffold originally created inside this backend repo for convenience; the authoritative frontend lives in `../brave-week3frontend`. You can safely delete the `frontend/` folder inside the backend repo if you prefer; I left the files in place in this environment to avoid accidental data loss while moving files between repositories.

