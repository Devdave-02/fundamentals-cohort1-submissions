# Project Summary: CodePilot Backend API

This repository contains the backend API for the **CodePilot** internal developer platform. It is designed to serve as a practical, reference implementation for the "Test Strategy: Coverage and Confidence" challenge.

## 🎯 Purpose

The primary goal of this project is to demonstrate a robust, multi-layered testing strategy for a modular Node.js API. It is built to solve the common engineering problems of poor test coverage and unreliable deployment confidence.

## ✨ Core Features

### 1. Application Architecture

* **Stack:** **Node.js** with the **Express** framework.
* **Design:** A **modular architecture** that separates concerns by feature (e.g., `auth`, `products`, `orders`).
* **Authentication:** Uses **JWT (JSON Web Tokens)** for securing routes, demonstrated in the `checkAuth` middleware and `orders` module.

### 2. Testing Strategy

This project proves its reliability by implementing a testing pyramid:

* **Unit Tests:** Use **Jest** to test individual services and business logic in isolation (e.g., `auth.service.test.js`).
* **Integration Tests:** Use **Supertest** to test the full request/response lifecycle of the API endpoints, including routing, middleware, and controller logic (e.g., `auth.routes.test.js`).
* **Code Coverage:** Enforces a project-wide **>80% coverage threshold** via the `jest.config.js` to ensure new code is adequately tested.

### 3. Project Deliverables

This repository includes all the required components for the challenge:

* **Express Application:** The complete, modular API in the `/src` directory.
* **Comprehensive Test Suite:** All unit and integration tests in the `/tests` directory.
* **CI/CD Pipeline:** A **GitHub Actions** workflow (`.github/workflows/ci.yml`) that automatically runs all tests on every push and pull request.
* **API Documentation:** A **Postman Collection** (`postman_collection.json`) for easy API interaction and manual testing.
* **Strategy Document:** A detailed `README.md` file explaining the testing strategy.