import type { Response, Request, NextFunction } from "express";
import { catchAsync } from "@src/lib/appError";
import { Post } from "@src/models/post";

const getFeeds = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(50, Number(req.query.pageSize) || 20);
    const skip = (page - 1) * pageSize;

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    return res.status(200).json({
      status: "success",
      message: "Feeds fetched successfully",
      data: {
        posts,
        page,
        pageSize,
      },
    });
  }
);

export { getFeeds };
