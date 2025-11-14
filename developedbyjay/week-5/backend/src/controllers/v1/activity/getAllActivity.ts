import { Activity } from "@src/models/activity";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const getActivities = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const activities = await Activity.find({ userId });

    res.status(200).json({
      status: "success",
      message: "Activities fetched successfully",
      data: activities,
    });
  }
);
