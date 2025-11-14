import type { NextFunction, Request, Response } from "express";
import { User } from "@/models/user";
import { AppError, catchAsync } from "@/_lib/appError";

export const getCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({ success: true, user });
  }
);
