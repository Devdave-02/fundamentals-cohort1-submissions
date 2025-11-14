import { AppError, catchAsync } from "@src/lib/appError";
import Task from "@src/models/task";
import { User } from "@src/models/user";
import { APIFeatures } from "@src/utils/apiFeatures";
import { queryStringType } from "@src/utils/types";
import type { Request, Response, NextFunction } from "express";

export const getAllTasks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const userQuery = req.query as queryStringType;

 
    const user = await User.findById(userId).select("role").lean().exec();

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (user.role !== "admin") {
      userQuery["user"] = req.userId;
    }

    const apiFeatures = new APIFeatures(Task.find(), Task.countDocuments(), {
      ...userQuery,
    })
      //   Fields to Filter
      .filter(["title"])
      .paginate()
      //   Fields to Remove
      .limitFields(["__v"])
      .sort(["createdAt", "updatedAt"]);

    const { queryCount, query } = apiFeatures.getQuery();
    const [tasks, total] = await Promise.all([query.lean().exec(), queryCount]);

    const totalPages = Math.ceil(total / apiFeatures.limit);
    const currentPage = Math.floor(apiFeatures.offset / apiFeatures.limit) + 1;
    const hasNextPage = apiFeatures.offset + apiFeatures.limit < total;
    const hasPrevPage = apiFeatures.offset > 0;

    res.status(200).json({
      code: "Success",
      message: "Tasks retrieved successfully",
      tasks,
      meta: {
        total,
        count: tasks.length,
        limit: apiFeatures.limit,
        offset: apiFeatures.offset,
        page: currentPage,
        totalPages,
        hasNextPage,
        hasPrevPage,
        ...(apiFeatures.search && { search: apiFeatures.search }),
        ...(apiFeatures.sortBy && {
          sortBy: apiFeatures.sortBy,
          sortOrder: apiFeatures.sortOrder || "asc",
        }),
      },
    });
  }
);
