# brave-week3frontend
Minimal React + Vite frontend for the Brave Week3 Secure Multi-Role API challenge.

This frontend demonstrates a safe client strategy for handling JWTs where the short-lived Access Token is kept in memory and the Refresh Token is stored in an HttpOnly cookie managed by the backend.

## Setup

1. Install dependencies:

```bash
cd brave-week3frontend
npm install
```

2. Start the dev server (this project proxies `/api` to the backend at `http://localhost:4000`):

```bash
npm run dev
```

3. Start the backend API (in a separate terminal) and ensure it is running on `http://localhost:4000`.

## What this frontend demonstrates

- Registration and Login UI (minimal). On login, the server returns an Access Token in the JSON response and sets a Refresh Token as an HttpOnly cookie.
- Access Token is stored ONLY in JavaScript memory (React state). It is not stored in localStorage or cookies.
- The app will use `/api/auth/refresh` (POST) to get a new Access Token when the current one expires. The refresh endpoint reads the Refresh Token from the HttpOnly cookie so JavaScript never has direct access to it.
- Tasks listing, creation, and (for admin users) deletion. The Delete button is only visible when the decoded access token's role is `admin`.

## Why store tokens this way?

- Storing Access Tokens in memory (instead of localStorage) reduces exposure to XSS. If an attacker can run JS on the page, they could read localStorage and steal tokens; keeping them in memory narrows that window.
- Storing Refresh Tokens as HttpOnly cookies prevents JavaScript access to the refresh token and reduces attack surface for token theft via XSS.
- The backend validates presented refresh tokens against a server-side list (stored in the user document) so refresh tokens can be revoked on logout.

## How the auth flow works (technical)

1. User submits credentials to `POST /api/auth/login`.
2. Backend verifies password and issues:
	- Access Token (short-lived, returned in JSON to client).
	- Refresh Token (longer-lived, set as HttpOnly cookie).
3. Client stores Access Token in memory and attaches it to `Authorization: Bearer <token>` for protected requests.
4. When the Access Token expires, client requests `POST /api/auth/refresh`. The backend reads the refresh cookie, validates it and issues a new Access Token.
5. On logout the client calls `POST /api/auth/logout`, and the backend removes the refresh token from the user's stored list and clears the cookie.

## Security notes

- Cross-Site Scripting (XSS): Avoid placing tokens in persistent JS-accessible storage. Keep the Access Token in memory. Use Content Security Policy (CSP) and other safe coding practices to reduce XSS risk.
- Cross-Site Request Forgery (CSRF): Because refresh tokens are cookies, consider CSRF protections (same-site cookies and/or anti-CSRF tokens) for production. This demo uses `SameSite=Lax` to reduce CSRF risk for basic flows.
- Broken Access Control: The backend enforces RBAC on every protected endpoint; the frontend only hides UI elements for non-admins but cannot be relied on for security.

## Files of interest

- `src/auth/Login.jsx` and `src/auth/Register.jsx` — simple credential forms.
- `src/tasks/Tasks.jsx` — loads tasks, creates tasks, attempts delete; uses the access token in memory.
- `vite.config.js` — dev proxy to backend API.

## Next steps / Improvements

- Implement refresh token rotation for greater security (issue a new refresh token on refresh and revoke the old one).
- Add CSRF tokens for state-changing endpoints if cookies are used for refresh tokens.
- Add stronger input sanitization and client-side validation.
- Add better UI/UX and unit/integration tests.

---

If you'd like, I can now:
- Run the frontend dev server and verify it connects to the backend.
- Add a short `USAGE.md` with example fetch requests.
