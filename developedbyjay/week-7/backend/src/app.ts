import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import express, { Request, Response, NextFunction } from "express";
import { corsOption } from "./_lib/cors";
import v1Router from "./routes/v1/index";
import { AppError } from "./_lib/appError";
import globalErrorController from "./controllers/error";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));
app.use(compression());

app.use("/v1", v1Router);

app.all("/{*splat}", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.log("Error middleware called",err);
  globalErrorController(err, res);
});

export default app;
