import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "@/_lib/appError";

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.clearCookie("accessToken");
    res.status(204).send();
  }
);
export { logout };
