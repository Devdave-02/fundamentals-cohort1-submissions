// controllers/postController.ts
import type { Request, Response, NextFunction } from "express";
import { AppError, catchAsync } from "@src/lib/appError";
import { Post } from "@src/models/post";
import { User } from "@src/models/user";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { content } = req.body;

    // fetch author snapshot
    const user = await User.findById(userId).select(
      "username displayName avatarUrl"
    );
    if (!user) return next(new AppError("User can not be found", 404));

    const post = await Post.create({
      author: userId,
      content,
      authorSnapshot: {
        _id: user._id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "post created successfully",
      data: post,
    });
  }
);

export { createPost };
