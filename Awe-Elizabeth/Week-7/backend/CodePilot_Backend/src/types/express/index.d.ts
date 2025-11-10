// src/types/express/index.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload & {
        id?: string;
        email?: string;
        tokenValidity?: number;
        role?: string;
      };
    }
  }
}

export {}; 
