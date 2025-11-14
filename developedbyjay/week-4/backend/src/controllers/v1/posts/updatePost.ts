
import type { Request, Response, NextFunction } from "express";
import { AppError, catchAsync } from "@src/lib/appError";
import { Post } from "@src/models/post";
import { User } from "@src/models/user";

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { postId } = req.params;
    const content = req.body;

    const user = await User.findById(userId).select(
      "username displayName avatarUrl"
    );
    if (!user) return next(new AppError("User can not be found", 404));

    const post = await Post.findByIdAndUpdate(postId, content, { new: true });

    return res.status(201).json({
      status: "success",
      message: "post updated successfully",
      data: post,
    });
  }
);

export { updatePost };
