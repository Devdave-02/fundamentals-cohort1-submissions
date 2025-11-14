import { catchAsync } from "@src/utils";
import type { NextFunction, Request, Response } from "express";


const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.clearCookie("accessToken");

    res.status(204).send();
  }
);
export { logout };
