import { AppError, catchAsync } from "@src/lib/appError";
import Task from "@src/models/task";
import { allowedPriorities, allowedStatuses } from "@src/utils";
import { TaskRequestBody } from "@src/utils/types";
import { Request, Response, NextFunction } from "express";

export const createTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, priority, status, dueDate } =
      req.body as TaskRequestBody;
    const userId = req.userId;

    if (!title || typeof title !== "string" || title.trim().length === 0)
      return next(new AppError("Task title is required", 400));

    if (priority && !allowedPriorities.includes(priority))
      return next(
        new AppError("Priority must be 'low', 'medium', or 'high'", 400)
      );

    if (status && !allowedStatuses.includes(status))
      return next(
        new AppError(
          "Status must be 'pending', 'in-progress', or 'completed'",
          400
        )
      );

    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        return next(new AppError("Invalid dueDate format", 400));
      }

      if (parsedDate < new Date()) {
        return next(new AppError("Due date must be a future date", 400));
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      priority: priority || "medium",
      status: status || "pending",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      user: userId,
    });

    res.status(201).json({
      status: "success",
      message: "Task created successfully",
      task,
    });
  }
);
