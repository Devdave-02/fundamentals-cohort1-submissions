// middleware/authJwt.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import  User  from "../models/User";

export async function auth(req: Request, res: Response, next: NextFunction) {
  const auth  = req.headers.authorization ;
  if (!auth?.startsWith("Bearer ")) return res.status(401).send({message: "Unauthorized"});

  const token = auth.split(" ")[1];
  try {
    const payload: any = jwt.verify(token || "", process.env.JWT_SECRET!);

    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({message: "Unauthorized"});

    if (user.isLocked) {
      return res.status(423).json({ message: "Account locked. Please try later." });
    }

    //check tokenVersion to invalidate tokens on lock or manual logout
    if (payload.tokenValidity !== user.tokenValidity) {
      return res.status(401).json({ message: "Token invalidated. Please login again." });
    }

    // attach user to req
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).send({message: "Unauthorized"});
  }
}

export const authorize = (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (allowedRoles.length === 0) return next();
  if (!allowedRoles.includes(req.user.role!)) return res.status(403).json({ message: "Forbidden" });
  return next();
};


