# DeployHub Backend

A production-ready Express.js backend service built with TypeScript, featuring health monitoring, metrics collection, and observability.

## Features

- Structured logging with Pino
- Prometheus metrics integration
- Health check endpoints
- CORS support
- Graceful shutdown handling
- Docker support with multi-stage builds

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** Express.js v5
- **Language:** TypeScript
- **Logging:** Pino
- **Metrics:** Prometheus (prom-client)
- **Security:** Helmet, CORS
- **Package Manager:** pnpm 10.11.1
- **Development:** tsx (TypeScript runner)

## Project Structure

```
deployhub-backend/
├── src/
│   ├── app.ts              # Express application setup
│   ├── server.ts           # Server initialization and lifecycle
│   ├── lib/
│   │   ├── logger.ts       # Pino logger configuration
│   │   └── metrics.ts      # Prometheus metrics setup
│   └── routes/
│       └── health.ts       # Health check endpoints
├── Dockerfile              # Multi-stage Docker build
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── pnpm-lock.yaml         # Dependency lock file
```


## API Endpoints

### Health Check

**GET** `/api/health`

Returns the health status of the service.

**Response:**

```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": 1699999999999
}
```

### Metrics

**GET** `/metrics`

Returns Prometheus-formatted metrics including:

- HTTP request duration histogram
- Default Node.js runtime metrics (memory, CPU, event loop, etc.)

## Monitoring

The application collects the following metrics:

- `http_request_duration_seconds` - HTTP request duration histogram with labels for method, route, and status code
- Default Node.js metrics (memory usage, CPU usage, event loop lag, etc.)

These metrics are exposed at the `/metrics` endpoint in Prometheus format and can be scraped by Prometheus or similar monitoring tools.

## Logging

The application uses Pino for structured JSON logging. Log levels can be configured via the `LOG_LEVEL` environment variable:

- `trace`
- `debug`
- `info` (default)
- `warn`
- `error`
- `fatal`

## Environment Variables

| Variable    | Description      | Default       |
| ----------- | ---------------- | ------------- |
| `PORT`      | Server port      | `3000`        |
| `LOG_LEVEL` | Logging level    | `info`        |
| `NODE_ENV`  | Environment mode | `development` |

## Graceful Shutdown

The application handles `SIGTERM` signals gracefully, closing the server and allowing in-flight requests to complete before shutting down.

## Security

- **Helmet:** Sets various HTTP headers for security
- **CORS:** Configurable cross-origin resource sharing (currently set to allow all origins)

