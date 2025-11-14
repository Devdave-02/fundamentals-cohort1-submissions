import Task from "@src/models/task";
import { Request, Response, NextFunction } from "express";
import { AppError, catchAsync } from "@src/lib/appError";
import { User } from "@src/models/user";
import { allowedPriorities, allowedStatuses } from "@src/utils";
import { queryStringType } from "@src/utils/types";

export const filterTasks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      status,
      priority,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.body;
    const userId = req.userId;

    const userData = await User.findById(userId).select("role").lean().exec();
    if (!userData) {
      return next(new AppError("User not found", 404));
    }

    const filter:queryStringType = {};

    
    if (status && !allowedStatuses.includes(status))
      return next(new AppError("Invalid status value", 400));

    if (priority && !allowedPriorities.includes(priority))
      return next(new AppError("Invalid priority value", 400));

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate);
      if (endDate) filter.dueDate.$lte = new Date(endDate);
    }

    if (userData.role !== "admin") {
      filter.user = userId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      results: tasks.length,
      pagination: {
        total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
      data: tasks,
    });
  }
);
