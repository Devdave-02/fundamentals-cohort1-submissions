# CodePilot Backend – Test Strategy: Coverage and Confidence

This repository contains the **backend API** for **CodePilot**, an internal developer platform designed to demonstrate best practices in **modular API architecture**, **automated testing**, and **continuous integration (CI)**.

This project was developed as part of the **CodePilot Bootcamp Week 7 Challenge — “Test Strategy: Coverage and Confidence.”**

---

## Project Overview

CodePilot Backend is a **Node.js (Express + TypeScript)** API that demonstrates:

- Modular architecture (`users`, `products`, `orders`)
- Database integration using **PostgreSQL** and **Prisma ORM**
- Comprehensive test coverage (unit, integration, and E2E)
- Automated CI/CD testing using **GitHub Actions**
- Clear test strategy to ensure **coverage and confidence**

---

## Tech Stack

| Layer     | Technology           |
| --------- | -------------------- |
| Language  | TypeScript           |
| Framework | Express.js           |
| ORM       | Prisma               |
| Database  | PostgreSQL           |
| Testing   | Jest + Supertest     |
| CI/CD     | GitHub Actions       |
| Auth      | JWT (JSON Web Token) |

---

## Environment Setup

### 1️⃣ Prerequisites

Make sure you have installed:

- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 14+](https://www.postgresql.org/) or a Postgres container in Docker
- [npm](https://www.npmjs.com/)

---

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nuelose/codepilot-backend.git
cd codepilot-backend
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Create a Test Database in PostgreSQL

**Option A** — Using PostgreSQL Shell or GUI (pgAdmin)
If you already have PostgreSQL installed, run the following commands:

```sql
CREATE DATABASE codepilot_test_db;
CREATE USER nuelo WITH PASSWORD 'pass';
GRANT ALL PRIVILEGES ON DATABASE codepilot_test_db TO nuelo;
```

**Option B** — Using Docker (Recommended)
If you prefer an isolated test environment or don’t have PostgreSQL installed locally, spin up a container instead:

```bash
docker run --name codepilot-test-db \
  -e POSTGRES_USER=nuelo \
  -e POSTGRES_PASSWORD=pass \
  -e POSTGRES_DB=codepilot_test_db \
  -p 5433:5432 \
  -d postgres
```

This will start a PostgreSQL 14 container with:

- Database: codepilot_test_db
- User: nuelo
- Password: pass
- Port: 5433 (mapped to container’s 5432)

---

### 4. Create a `.env.test` File

Copy the example and update it to match your PostgreSQL credentials:

```bash
cp .env.test.example .env.test
```

Then edit `.env.test`:

```bash
# .env.test
DATABASE_URL="postgresql://nuelo:pass@localhost:5433/codepilot_test_db"
PORT=3001
JWT_SECRET=your_generated_secret_here
JWT_EXPIRES_IN="1d"
```

**Tip:** You can generate a random JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 5. Run Prisma Migrations

Apply migrations to your test database:

```bash
NODE_ENV=test npx prisma migrate deploy
```

You can verify the DB connection using:

```bash
npx prisma studio
```

---

### 6. Run the Tests

Execute all test suites:

```bash
npm test
```

Or run with coverage:

```bash
npm run test:coverage
```

After running, you’ll see coverage reports in `/coverage`.

---

## Testing Strategy

This project follows a **layered testing strategy** to ensure both **coverage** (breadth) and **confidence** (reliability):

### 1️ Unit Tests

- Focus on **pure functions and services**.
- Ensure that business logic works independently of the database or network.

### 2️ Integration Tests

- Test **API routes and middleware** using **Supertest**.
- Verify how Express, Prisma, and validation layers work together.

### 3️ End-to-End (E2E) Tests

- Simulate real user workflows: authentication, CRUD operations, etc.
- Use an isolated **test database** for predictable results.

### 4️ Coverage and Confidence

- Coverage is automatically measured using Jest’s built-in reporting.
- Confidence comes from:

  - Clean test isolation (`beforeEach` database cleanup).
  - Separation of test and production environments (`.env.test`).
  - Automatic CI execution on each push or pull request.

<img src="./coverage-screenshot.png" width=800px> 
---

## GitHub Actions CI

This project includes a `.github/workflows/node.js.yml` configuration that:

1. Installs Node.js and dependencies.
2. Runs tests automatically on **push** or **pull request** to `main`.
3. Ensures all test suites pass before merging.

If you want CI to run your tests automatically, add a PostgreSQL service in the workflow like this:

```yaml
services:
  postgres:
    image: postgres:14
    ports:
      - 5432:5432
    env:
      POSTGRES_USER: nuelo
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: codepilot_test_db
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

Then your `env.test` should connect to:

```
postgresql://nuelo:pass@localhost:5432/codepilot_test_db
```

---

## Postman API Documentation

A **Postman Collection** is provided in this repo for quick testing:

- File: `CodePilot.postman_collection.json`
- Import it into Postman to explore endpoints for:

  - `/api/users`
  - `/api/products`
  - `/api/orders`

---

## Expected Deliverables

| Requirement                      | Status |
| -------------------------------- | ------ |
| Modular Express app              | ✅     |
| Unit, Integration, and E2E tests | ✅     |
| Coverage report (`/coverage`)    | ✅     |
| GitHub Actions CI                | ✅     |
| `.env.test.example` included     | ✅     |
| Postman collection               | ✅     |
