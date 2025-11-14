import client from "prom-client";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../Middlewares/protect";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
});
register.registerMetric(httpRequestDuration);

const httpErrorsTotal = new client.Counter({
  name: "http_errors_total",
  help: "Total number of HTTP errors",
  labelNames: ["method", "route", "status_code"], // Categorize errors
});
register.registerMetric(httpErrorsTotal);

const appUptimeGauge = new client.Gauge({
  name: "app_uptime_seconds",
  help: "Application uptime in seconds",
  labelNames: ["service"], // If you have multiple services in one app or want to tag
});
register.registerMetric(appUptimeGauge);

function requestTimingMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000_000;

    const routePath = req.route?.path || req.baseUrl + req.path || req.path;

    // Observe the request duration
    httpRequestDuration.observe(
      {
        method: req.method,
        route: routePath,
        status_code: res.statusCode,
      },
      duration
    );

    // Increment error counter for server errors (e.g., 5xx)
    if (res.statusCode >= 500 && res.statusCode < 600) {
      httpErrorsTotal.inc({
        method: req.method,
        route: routePath,
        status_code: res.statusCode,
      });
    }
  });

  next();
}

export {
  register,
  httpRequestDuration,
  httpErrorsTotal,
  appUptimeGauge,
  requestTimingMiddleware,
};
