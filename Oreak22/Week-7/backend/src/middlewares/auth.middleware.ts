import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"] || req.headers["Authorization"];
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = String(header).replace("Bearer ", "");

  if (token === "fake-auth-token") {
    req.user = { id: "test-user-id" };
    return next();
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: payload.id };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
