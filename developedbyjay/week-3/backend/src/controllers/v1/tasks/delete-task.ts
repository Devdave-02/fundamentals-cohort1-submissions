import { AppError, catchAsync } from "@src/lib/appError";
import Task from "@src/models/task";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

export const deleteTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return next(new AppError("Invalid task ID", 400));

    const task = await Task.findByIdAndDelete(id);

    if (!task) return next(new AppError("Task not found", 404));

    res.status(200).json({
      status: "success",
      message: "Task deleted successfully",
    });
  }
);
