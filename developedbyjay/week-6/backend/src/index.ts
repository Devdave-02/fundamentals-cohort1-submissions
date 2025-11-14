import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import { router as v1Router } from "@routes/v1/index.route";
import globalErrorController from "./controllers/error";
import express, { NextFunction, Request, Response } from "express";
import { normalizedQuery } from "./middleware/normalized-query";
import { corsOption } from "./lib/cors";
import { logger } from "./lib/winston-logger";
import { AppError } from "./lib/app-error";
import { use_prisma } from "./lib/prisma-client";

const app = express();

const port = process.env.PORT || 3000;


// It is used to serve as a mutation for the req.query which can't be mutated due to its getter function
app.use(normalizedQuery);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));
app.use(cookieParser());
app.use(compression());

(async function (): Promise<void> {
  try {
    app.use("/v1", v1Router);

    await use_prisma.$connect();

    app.listen(port, () => {
      logger.info(`App listening on port ${port} at http://localhost:${port}`);
    });
  } catch (err) {
    logger.error(`Failed to start server`, err);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

app.all("/{*splat}", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  globalErrorController(err, res);
});

const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  try {
    logger.info("server shutdown", signal);
    await use_prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    logger.error("Error shutting down server", error);
  }
};

process.on("SIGINT", serverTermination); // Handle Ctrl+C
process.on("SIGTERM", serverTermination); // Handle termination signals
