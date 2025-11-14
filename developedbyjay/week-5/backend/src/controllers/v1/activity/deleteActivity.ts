import { AppError } from "@src/lib/appError";
import { Activity } from "@src/models/activity";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const deleteActivity = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const userId = req.userId;

    await Activity.findOneAndDelete({
      _id,
      userId,
    });
    return res.status(204).json({
      status: "success",
      message: "Activity deleted successfully",
    });
  }
);
