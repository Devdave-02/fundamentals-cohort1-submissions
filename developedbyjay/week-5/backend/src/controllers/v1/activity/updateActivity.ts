import { AppError } from "@src/lib/appError";
import { Activity } from "@src/models/activity";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const updateActivity = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const userId = req.userId;
    const activity = await Activity.findOne({
      _id,
      userId,
    });

    if (!activity) return next(new AppError("Activity not found", 404));

    Object.assign(activity, req.body);

    const updatedActivity = await activity.save();

    return res.status(200).json({
      status: "success",
      message: "Activity updated successfully",
      data: updatedActivity,
    });
  }
);
