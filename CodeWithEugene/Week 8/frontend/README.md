# DeployHub Frontend

React + Vite dashboard that surfaces delivery pipeline signals coming from the DeployHub backend service.

## Features
- Health snapshot, release metadata, and observability helper cards
- Configurable backend origin via `VITE_API_BASE_URL`
- Auto-refreshing (30s default) health polling with manual refresh button
- Responsive UI with metric tiles and structured status cards
- Vitest + Testing Library coverage and ESLint + Prettier formatting
- GitHub Actions pipeline with lint, test, build, and Vercel deployment trigger

## Getting Started

```bash
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173` and ensure the backend is available at the URL configured in `.env`.

### Scripts
- `npm run dev` – Vite dev server with hot module reload
- `npm run build` – production build output in `dist/`
- `npm run preview` – preview the production build locally
- `npm run lint` – run ESLint
- `npm run test` – Vitest unit tests (JSDOM environment)

## Deployment

Optimized for Vercel, but compatible with any static host:

1. Create a Vercel project and link the GitHub repo
2. Set environment variables (`VITE_API_BASE_URL`, optional dashboard links)
3. Create GitHub Action secrets: `VERCEL_TOKEN`, `VERCEL_PROJECT`, `VERCEL_ORG`, `VERCEL_PROJECT_URL`
4. Protect the `main` branch and require the "Frontend CI/CD" workflow

> **Deployed URL**: `https://deployhub-frontend.vercel.app`

## Observability Hooks
- Backend metrics link opens `/metrics` Prometheus endpoint
- Status card displays Git SHA (`GIT_SHA` env) and release timestamp exported by backend pipeline
- Extend with real dashboards via `VITE_OBSERVABILITY_DASHBOARD_URL`

## Testing Strategy
- Unit test coverage for the top-level App layout and rendering
- Mocked fetch calls ensure deterministic CI runs without hitting live services

## Folder Structure

```text
src/
  components/      Reusable UI primitives (status cards, metric tiles)
  hooks/           Custom polling & data fetching hooks
  services/        API client for backend communication
  styles/          Tailored CSS for dashboard styling
  __tests__/       Vitest specs
```

## Roadmap Ideas
- Add WebSocket channel for push-based health updates
- Display Prometheus P95 latency + error budget charts
- Persist environment selections per user via local storage

## License
MIT © DeployHub
