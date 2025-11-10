# DeployHub Backend

Node.js (Express) microservice instrumented with structured logging and Prometheus metrics as part of the DeployHub CI/CD and observability challenge.

## Features
- Express API with modular routing and centralized error handling
- Health `/api/health` and status `/api/status` endpoints exposing version, uptime, host metadata, and metrics snapshot
- Prometheus metrics at `/metrics` with request counters, error counters, duration histograms, and uptime gauge
- Structured logging via Winston + express-winston
- Dockerfile suitable for Render/Railway deployments and local development
- GitHub Actions workflow for linting, testing, Docker build, and Render trigger
- Postman collection under `postman/` for quick endpoint exploration

## Getting Started

```bash
cp .env.example .env
npm install
npm run dev
```

The service starts on `http://localhost:4000` by default.

### Core Scripts
- `npm run dev` – start with nodemon reloads
- `npm run lint` – ESLint static analysis
- `npm test` – Jest + Supertest unit tests with coverage
- `npm run docker:build` – build container image locally

### Observability Endpoints
- `GET /api/health` – health payload, version, uptime, basic resource usage, metrics snapshot
- `GET /api/status` – high-level service status and release metadata
- `GET /metrics` – Prometheus exposition format for scraping (Grafana, Render dashboards, etc.)

### Prometheus Quickstart
Add the backend scrape job to your Prometheus configuration:

```yaml
scrape_configs:
  - job_name: deployhub-backend
    metrics_path: /metrics
    static_configs:
      - targets: ['deployhub-backend.onrender.com']
```

### Structured Logs
Logs are JSON in production and colorized in development. Sample entry:

```json
{
  "level": "info",
  "message": "DeployHub backend listening on port 4000",
  "service": "deployhub-backend",
  "environment": "development",
  "timestamp": "2025-11-10T08:00:00.000Z"
}
```

Forward the logs to a log aggregator (e.g., Render Events, Datadog, Loki) for dashboards and alerting.

## Testing & Quality

The GitHub Actions workflow (`.github/workflows/backend-ci.yml`) runs ESLint, Jest tests, and a Docker build for every push/PR targeting `main` or `develop`.

To run locally:

```bash
npm run lint
npm test
```

## Deployment

The repository is designed for Render deployment (free tier-friendly):

1. Create a Render Web Service from the GitHub repo, using Docker deploy type
2. Set environment variables (`PORT`, `LOG_LEVEL`, `GIT_SHA`, `RELEASED_AT`, etc.)
3. Map to branch `main`
4. Configure `RENDER_API_KEY`, `RENDER_SERVICE_ID`, and `RENDER_SERVICE_URL` as GitHub Action secrets
5. Upon merging to `main`, the workflow triggers a new Render deploy

> **Deployed URL**: `https://deployhub-backend.onrender.com` (replace with your live instance)

If you prefer Railway or another host, adapt the deployment job accordingly; the rest of the stack remains unchanged.

## Postman Collection
Import `postman/deployhub-backend.postman_collection.json` to interact with the API. Update `{{baseUrl}}` to your deployment origin.

## Architecture Overview

```text
src/
  app.js              Express app wiring and observability middleware
  server.js           HTTP server bootstrapping + graceful shutdown
  routes/             Modular routers (health, status)
  controllers/        Business logic for routes
  metrics/            Prometheus registry & middleware
  middleware/         Logging and error normalization
```

## Branch Protection Recommendation
Enable branch protection on `main` to require the "Backend CI/CD" workflow, ensuring tests pass before merging. Configure at **Settings → Branches → Branch protection rules**.

## Observability Integration Ideas
- Connect `/metrics` to Grafana via Prometheus to visualize request volumes, latencies, error rates
- Forward logs to Grafana Loki or Render logs, build retention dashboards
- Add alerts (e.g., error rate > 5%, latency P95 > 500ms) with Prometheus Alertmanager or Render health checks

## License
MIT © DeployHub
