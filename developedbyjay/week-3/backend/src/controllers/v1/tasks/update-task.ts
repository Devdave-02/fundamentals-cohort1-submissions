import { AppError, catchAsync } from "@src/lib/appError";
import Task from "@src/models/task";
import { allowedPriorities, allowedStatuses } from "@src/utils";
import { TaskRequestBody } from "@src/utils/types";
import { Request, Response, NextFunction } from "express";

export const updateTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, description, priority, status, dueDate } =
      req.body as TaskRequestBody;

    if (title && (typeof title !== "string" || title.trim().length === 0))
      return next(new AppError("Title must be a valid non-empty string", 400));

    if (priority && !allowedPriorities.includes(priority))
      return next(
        new AppError("Priority must be 'low', 'medium', or 'high'", 400)
      );

    if (status && !allowedStatuses.includes(status))
      return next(new AppError("Invalid status value", 400));

    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        return next(new AppError("Invalid dueDate format", 400));
      }

      if (parsedDate < new Date()) {
        return next(new AppError("Due date must be a future date", 400));
      }
    }

    const task = await Task.findById(id);

    if (!task) return next(new AppError("Task not found", 404));

    if (title) task.title = title.trim();
    if (description) task.description = description.trim();

    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (dueDate) task.dueDate = new Date(dueDate);

    await task.save();

    res.status(200).json({
      status: "success",
      message: "Task updated successfully",
      task,
    });
  }
);
