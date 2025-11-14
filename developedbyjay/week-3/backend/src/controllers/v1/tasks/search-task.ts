import Task from "@src/models/task";
import { Request, Response, NextFunction } from "express";
import { AppError, catchAsync } from "@src/lib/appError";
import { User } from "@src/models/user";

export const searchTasks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query = "", page = 1, limit = 10 } = req.body;
    const userId = req.userId;

    if (typeof query !== "string")
      return next(new AppError("Query must be a string", 400));

    const skip = (Number(page) - 1) * Number(limit);

    const user = await User.findById(userId).lean().exec();
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const searchCondition: any = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    };

    // Restrict normal users to their own tasks
    if (user.role !== "admin") {
      searchCondition.user = userId;
    }

    const [tasks, total] = await Promise.all([
      Task.find(searchCondition)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Task.countDocuments(searchCondition),
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
