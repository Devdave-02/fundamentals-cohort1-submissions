DevConnect - Backend (Express + Mongoose)

A lightweight backend scaffold for DevConnect — a developer collaboration platform where users can register, create project posts, and comment on projects.

Tech stack
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- Jest + Supertest for unit tests

Repository contents
- `src/` - application source
	- `models/` - Mongoose models (User, Project, Comment)
	- `controllers/` - controller logic for auth and projects
	- `routes/` - Express routes for `/api/auth` and `/api/projects`
	- `middleware/` - authentication middleware
- `tests/` - unit tests (Jest)
- `.env.example` - example environment variables

Quick start (local)
1. Copy environment example:

```bash
cp .env.example .env
# Edit .env and set MONGO_URI and JWT_SECRET
```

2. Install dependencies:

```bash
npm install
```

3. Run tests:

```bash
npm test
```

4. Start the server (development):

```bash
npm run dev
```

Environment variables
- `PORT` - server port (default: 4000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret for signing JWTs

API (overview)
- POST /api/auth/register — register a new user (username, email, password)
- POST /api/auth/login — login (email, password)
- GET /api/auth/me — get current user (requires Bearer token)
- GET /api/projects — list projects
- POST /api/projects — create a project (requires Bearer token)
- GET /api/projects/:id — get project details

Notes on testing
- The included tests are unit tests that mock Mongoose models for fast, environment-independent runs. If you prefer integration tests with a real or in-memory MongoDB, you can add `mongodb-memory-server` and update the tests accordingly.

Postman & API documentation
- Create and export a Postman collection for the API endpoints above. Publish the collection to Postman and include the public share link here when available.

Deployment
- Recommended providers: Render, Railway, Vercel (for serverless), Heroku, DigitalOcean App Platform.
- When deploying, set environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) in the hosting provider.

Invitation & access
- Make the repo private and invite `@braveredemptive` for review access per the challenge instructions.

Next steps (suggested)
- Implement comments endpoints (POST /api/projects/:id/comments, GET comments)
- Add request/response validation and rate limiting
- Add Postman collection and publish API documentation link
- Add CI to run tests on push (GitHub Actions)
