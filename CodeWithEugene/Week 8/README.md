# Software Engineering Week 8 – CI/CD + Observability Challenge

This workspace contains the reference implementation for the DeployHub case study. It is split into two deployables:

- `backend/` – Node.js (Express) API with observability instrumentation
- `frontend/` – React + Vite dashboard that consumes backend health telemetry

## Repository Layout

Each folder is meant to become its own GitHub repository:

| Folder     | Suggested GitHub Repo    | Deployment Target | Notes |
|------------|---------------------------|-------------------|-------|
| `backend/` | `deployhub-backend`       | Render / Railway  | Express API with Winston logs, Prometheus metrics, Dockerfile, GitHub Action |
| `frontend/`| `deployhub-frontend`      | Vercel            | React UI with vite-based build, tests, Dockerfile, GitHub Action |

> When splitting into separate repos, copy each folder to a fresh git history and push to the target remote. Update the README URLs with the live endpoints once deployed.

## CI/CD Highlights

- GitHub Actions workflows for backend and frontend enforce linting, testing, and container builds on every push/PR
- Deploy jobs trigger Render (backend) or Vercel (frontend) deployments after the quality gates succeed
- Designed to work with branch protections requiring CI success before merge

## Observability Highlights

- Structured JSON logging via Winston + express-winston; traceability enriched with `x-request-id`
- Prometheus metrics (`/metrics`) capturing request counts, error counts, latency histograms, and uptime gauge
- Health/status endpoints consumed by the frontend dashboard to surface version, release metadata, and environment context
- Frontend ready to link into external dashboards via `VITE_OBSERVABILITY_DASHBOARD_URL`

## Local Development

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

With both services running (`backend` on port 4000, `frontend` on port 5173), browse to `http://localhost:5173` to view the dashboard.

## Deployment URLs

Update these once live:

- Backend: `https://deployhub-backend.onrender.com`
- Frontend: `https://deployhub-frontend.vercel.app`

## Postman

Import `backend/postman/deployhub-backend.postman_collection.json` for manual API exploration or regression suites.

## Next Steps

1. Wire GitHub repositories to Render/Vercel using the provided workflows
2. Connect `/metrics` to a Prometheus + Grafana stack for long-term dashboards
3. Extend tracing with OpenTelemetry exporters if deeper distributed tracing is required
