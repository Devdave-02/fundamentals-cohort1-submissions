# Flowserve Backend

This repository contains the backend API for Flowserve. It's a TypeScript Node application using Express and Prisma (PostgreSQL by default) as the ORM. The project includes authentication, user management, and transaction endpoints.

## Repository layout

- `src/` — TypeScript source files
  - `index.ts` — application entry
  - `controllers/` — request handlers (v1 controllers live under `v1/`)
  - `lib/` — small helpers (Prisma client wrapper, JWT, logger, rate-limit, etc.)
  - `middleware/` — auth, validation, normalize query
  - `routes/` — Express route definitions (v1 routes in `routes/v1/`)
  - `schemas/` — validation schemas (users, transactions)
  - `utils/` — small utility helpers
- `prisma/` — Prisma schema and migrations
- `generated/prisma/` — generated Prisma client
- `package.json` — npm scripts and dependencies
- `tsconfig.json` — TypeScript configuration

## Requirements

- Node.js (16+ recommended)
- pnpm (preferred, or npm/yarn)
- PostgreSQL (or another provider configured via `DATABASE_URL`)

## Environment variables

Create a `.env` file in the project root (or provide variables via your environment):

- `DATABASE_URL` — Prisma database connection string
- `PORT` — optional, port for the server (default e.g. 3000)
- `JWT_SECRET` — secret used to sign JWTs
- (Optional) any other env-specific keys used by your deployment (logging, third-party keys)

Note: The repository contains a generated Prisma client in `generated/prisma/` but it's a good practice to re-generate the client after changing `prisma/schema.prisma`.

## Install

Using pnpm (recommended):

```powershell
pnpm install
```

Or with npm:

```powershell
npm install
```

## Generate / update Prisma client

If you change the Prisma schema or need to generate the client:

```powershell
pnpm prisma generate
# or
npx prisma generate
```

To apply migrations (development):

```powershell
pnpm prisma migrate dev
# or
npx prisma migrate dev
```

## Common scripts

Check `package.json` for exact script names. Typical commands:

- `pnpm dev` — run in development (ts-node, nodemon, or equivalent)
- `pnpm build` — compile TypeScript
- `pnpm start` — run compiled code
- `pnpm test` — run tests (if present)

If a `dev` script is not available, the project can be started with `ts-node` or by building (`pnpm build`) and running Node on the compiled output.

## Running the app (development)

1. Ensure environment variables are set.
2. Install dependencies.
3. Apply migrations (if required) and generate the client.
4. Start the development server.

Example (development):

```powershell
# install
pnpm install
# generate prisma client
pnpm prisma generate
# run migrations (if you want a local DB schema)
pnpm prisma migrate dev
# start dev server
pnpm dev
```

## API overview (v1)

Routes are mounted under `/v1` and follow REST conventions. The main route files are in `src/routes/v1/`.

- Authentication
  - `POST /v1/auth/register` — register a new user
  - `POST /v1/auth/login` — authenticate and receive a JWT
- Users
  - `GET /v1/users` — list users (protected/authorized)
  - `DELETE /v1/users/:id` — delete a user (protected/authorized)
- Transactions
  - `GET /v1/transactions` — list transactions (supports normalized query parameters)
  - `POST /v1/transactions` — create a transaction (validation in `schemas/`)
  - `DELETE /v1/transactions/:id` — delete a transaction

Authorization: routes that require authentication use the middleware in `src/middleware/authenticate.ts` and `authorization.ts`.

Validation: request payloads are validated with schemas from `src/schemas/` and a `validator` middleware.
