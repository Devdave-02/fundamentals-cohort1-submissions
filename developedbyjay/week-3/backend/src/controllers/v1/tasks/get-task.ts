import { AppError, catchAsync } from "@src/lib/appError";
import Task from "@src/models/task";
import { User } from "@src/models/user";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

export const getTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return next(new AppError("Invalid task ID", 400));

    const user = await User.findById(req.userId).exec();

    let filter: any = {};

    if (user!.role !== "admin") {
      filter.user = req.userId;
    }

    const task = await Task.findOne({ _id: id, ...filter });

    if (!task) return next(new AppError("Task not found", 404));

    res.status(200).json({
      status: "success",
      message: "Task fetched successfully",
      task,
    });
  }
);
