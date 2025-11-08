"""# Set up
**Clone this repo**

**Create .env file and add variable**
PORT
MONGO_URI
JWT_SECRET

**To start the app**
Run **npm run dev**

**To run test**
run **npm test**

---

"""# Testing Strategy: Coverage and Confidence

Our testing approach is designed to achieve **broad coverage** across all application layers while maintaining **high confidence** in production stability. We follow a layered testing strategy using **Jest**, **Supertest**, and **mongodb-memory-server** to simulate real-world workflows.

---

## **1. Test Levels**

| Test Type                  | Purpose                                                           | Tools                                    | Scope                                      |
| -------------------------- | ----------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------ |
| **Unit Tests**             | Verify individual functions and business logic in isolation.      | Jest                                     | Services, utilities, helpers               |
| **Integration Tests**      | Ensure modules (controllers, routes, DB) work together correctly. | Jest + Supertest + MongoDB Memory Server | Auth, Orders, Products APIs                |
| **End-to-End (E2E) Tests** | Validate complete workflows from API request to DB response.      | Supertest                                | Auth flow, order creation, product listing |

---

## **2. Coverage Goals**

- **Statements:** ≥ 80%
- **Functions:** ≥ 80%
- **Branches:** ≥ 70%
- **Lines:** ≥ 80%

These thresholds are enforced in `jest.config.js` and verified automatically in CI.  
A coverage report (`/coverage`) is generated after each test run for review.

---

## **3. Confidence Through Automation**

- All tests run automatically in **GitHub Actions CI** on every push or pull request.
- Failures in tests or coverage thresholds block merges to main branches.
- **mongodb-memory-server** provides an isolated, ephemeral database for realistic data testing — no external DB required.
- **Mocks and stubs** are used for non-critical external dependencies (e.g., JWT, password hashing).

---

## **4. Error & Edge Case Handling**

Tests include:

- Invalid credentials and token expiration
- Nonexistent resources (`404`)
- Missing or invalid fields (`400`)
- Unauthorized access (`401`)

This ensures robustness against regressions and increases confidence that the system behaves correctly under unexpected conditions.

---

## **5. Continuous Confidence**

Each successful CI run confirms:

- Code integrity and stability before deployment
- Consistent test performance across environments
- Maintained coverage levels and code quality over time

Together, these provide the team with high **test confidence** and reduce the risk of regressions in production.
"""
