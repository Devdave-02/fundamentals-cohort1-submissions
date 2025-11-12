import { Request, Response, NextFunction } from "express";
import logger from "../util/logger";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err);
  res.status(500).json({ message: err.message || "Server error" });
}