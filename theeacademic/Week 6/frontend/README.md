# FlowServe Frontend (React + Vite)

A lightweight React app to exercise the FlowServe backend API. It lists users with pagination and lets you simulate new transactions.

## Getting started

### 1) Environment

Copy `.env.local.example` to `.env.local` and set the API base URL if different from the default:

```
cp .env.local.example .env.local
```

Variables:

- `VITE_API_BASE_URL` – default: `http://localhost:3000/api`

### 2) Install dependencies

```
npm install
```

### 3) Run the dev server

```
npm run dev
```

Visit the URL shown (default `http://localhost:5173`).

## Features

- Fetch and paginate users from `GET /api/users`
- Simulate transactions via `POST /api/transactions`
- Clear loading, error, and success states
- Clean, responsive layout
