import { AppError, catchAsync } from "@src/lib/appError";
import { User } from "@src/models/user";
import { Request, Response, NextFunction } from "express";

export const getCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId).exec();

    if (!user) next(new AppError("User not found", 404));

    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      user,
    });
  }
);
