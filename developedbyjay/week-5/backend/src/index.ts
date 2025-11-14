import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import { router as v1Router } from "@routes/v1/index";
import globalErrorController from "@controllers/error";
import express, { NextFunction, Request, Response } from "express";
import { connectToDatabase, disconnectFromDatabase } from "@lib/mongoose";
import { AppError } from "@lib/appError";
import { corsOption } from "@lib/cors";

const app = express();
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));
app.use(cookieParser());
app.use(compression());

(async function (): Promise<void> {
  try {
    app.use("/v1", v1Router);

    await connectToDatabase();

    app.listen(port, () => {
      console.info(`App listening on port ${port} at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(`Failed to start server`, err);
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
    console.info("server shutdown", signal);

    await disconnectFromDatabase();

    process.exit(0);
  } catch (error) {
    console.error("Error shutting down server", error);
  }
};

process.on("SIGINT", serverTermination); // Handle Ctrl+C
process.on("SIGTERM", serverTermination); // Handle termination signals
