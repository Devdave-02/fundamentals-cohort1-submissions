# CODEPILOT

An Express + TypeScript backend that implements a shopping cart service (products, users, cart operations). The project includes unit, integration, and end-to-end tests with coverage reporting and a CI workflow that runs tests on push.


## Quick start

Prerequisites:

- Node.js (recommended LTS)
- pnpm (project uses pnpm as package manager)

Install and run locally:

```pwsh
# from repository root
pnpm install

# run in development (uses tsx watch)
pnpm run dev
```

Server entry: `src/server.ts` (environment: `src/.env` when present).

## Available scripts

- `pnpm start` — run the built server (uses `tsx` to run TypeScript directly with runtime env file).
- `pnpm run dev` — development mode (watch + restart).
- `pnpm test` — run the full test suite (uses Jest).
- `pnpm run test:watch` — run tests in watch mode.
- `pnpm run test:coverage` — run tests and generate coverage report (output in `coverage/`).

## Testing Strategy

Goal: ensure correctness and keep fast feedback while providing high confidence that the service works as intended in isolation and when integrated with dependencies.

I use a three-tiered testing approach:

- Unit tests (fast, isolated):

  - Live under `tests/unit`.
  - Focus on pure functions, helpers, and small controller logic. External dependencies (database, network, file system) are mocked.
  - Run very quickly and provide quick developer feedback on regressions.

- Integration tests (component-level):

  - Live under `tests/integration`.

  - Use Supertest to exercise Express routes and middleware with a running instance of the app (but still isolated from external systems).

- End-to-end tests (workflow-level):
  - Live under `tests/e2e`.
  - Exercise full request flows and behaviors that cross multiple layers (auth -> create product -> add to cart -> retrieve cart). These tests provide high confidence that the application wiring works from HTTP to persistence.

Why this mix ensures coverage and confidence:

- Speed + Isolation: Unit tests run quickly and locate defects close to the source of logic.
- Realism: Integration tests run against MongoDB so queries, indexes, and Mongoose behavior are exercised without flakiness from shared infra.
- End-to-end verification: E2E tests ensure the system behaves correctly end-to-end and guard against integration regressions.
- CI enforcement: The repository includes a CI workflow that runs the test suite and publishes coverage; this prevents accidental regressions from being merged.

Measures I use to keep tests reliable:

- Centralized test setup/teardown: Jest setup is configured in `jest.config.cjs` and `tests/utils/setup-tests.ts` to ensure consistent environment for all tests.
- Deterministic test data: tests use clearly defined fixtures and the mongoDB database will reset between test suites to avoid cross-test contamination.
- Focused assertions: tests assert both status codes and key response shapes/DB side-effects to catch logic and persistence errors.


## Test structure and responsibilities

- `tests/unit` — unit tests for helpers, JWT utility, validation, and small controller functions.
- `tests/integration` — integration tests that verify DB interactions.
- `tests/e2e` — end-to-end tests that exercise full workflows.
- `tests/utils` — helpers to boot the test server, manage env, and seed/reset the database.

## How to add tests

1. Decide the level (unit/integration/e2e). Unit tests -> mock external dependencies. Integration -> use in-memory DB. E2E -> exercise full HTTP flows.
2. Place the test file under the appropriate `tests/` subfolder.
3. Use the existing test utilities in `tests/utils` (e.g., test-server) for consistent setup.
4. Run the new tests locally with `pnpm test` or `pnpm run test:watch`.

## CI and coverage

- CI runs the test suite and generates a coverage report on every push/PR (see `.github/workflows` in the repo for the workflow).
- The coverage output is stored in `coverage/` after local `pnpm run test:coverage` and the HTML report can be opened from `coverage/lcov-report/index.html`.

## DOCUMENTATION
- API documentation is available via Postman. Access it at https://documenter.getpostman.com/view/27459994/2sB3WsPz9p
