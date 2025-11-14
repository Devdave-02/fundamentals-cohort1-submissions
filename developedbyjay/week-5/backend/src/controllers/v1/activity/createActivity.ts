import { Activity, IActivity } from "@src/models/activity";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const createActivity = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { type, duration, caloriesBurned } = req.body as IActivity;

    const activity = await Activity.create({
      userId,
      type,
      duration,
      caloriesBurned,
    });

    return res.status(201).json({
      status: "success",
      message: "Activity created successfully",
      data: activity,
    });
  }
);
