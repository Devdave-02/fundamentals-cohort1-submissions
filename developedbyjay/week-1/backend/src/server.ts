import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import express, { Request, Response, NextFunction } from "express";
import { corsOption } from "./_lib/cors";
import v1Router from "./routes/v1/index";
import { AppError } from "./_lib/appError";
import globalErrorController from "./controllers/error";
import { connectToDatabase, disconnectFromDatabase } from "./_lib/mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));
app.use(compression());

(async function (): Promise<void> {
  try {
    app.use("/v1", v1Router);
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
})();

const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  try {
    await disconnectFromDatabase();

    process.exit(0);
  } catch (error) {
    console.error("Error shutting down server", error);
  }
};

app.all("/{*splat}", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  globalErrorController(err, res);
});

process.on("SIGINT", serverTermination);
process.on("SIGTERM", serverTermination);
