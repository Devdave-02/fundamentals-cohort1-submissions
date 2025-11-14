import { AppError } from "@src/lib/app-error";
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@lib/jwt";
import { catchAsync } from "@src/utils";

const authenticate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new AppError("Access Token missing", 401));
    }

    const token = authorization!.split(" ")[1];
    const decoded = verifyAccessToken(token) as { userId: string };

    if (!decoded || !decoded.userId) {
      return next(new AppError("Invalid Access Token", 401));
    }

    req.userId = decoded.userId;
    next();
  }
);

export { authenticate };
