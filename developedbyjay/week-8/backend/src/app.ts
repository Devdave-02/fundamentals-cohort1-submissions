import express from "express";
import pinoHttp from "pino-http";
import cors from "cors";
import logger from "./lib/logger";
import metricsRegister, { httpRequestDuration } from "./lib/metrics";
import healthRoutes from "./routes/health";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(pinoHttp({ logger }));

app.use((req, res, next) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationSeconds = diff[0] + diff[1] / 1e9;
    httpRequestDuration
      .labels(req.method, req.path, String(res.statusCode))
      .observe(durationSeconds);
  });
  next();
});

app.use("/api/health", healthRoutes);

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", metricsRegister.contentType);
  res.send(await metricsRegister.metrics());
});

// Handle Global Errors
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    _req.log?.error({ err }, "Unhandled error");
    res.status(err.status || 500).json({ error: "Internal Server Error" });
  }
);

export default app;
