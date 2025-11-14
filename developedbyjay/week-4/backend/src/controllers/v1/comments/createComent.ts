import { AppError, catchAsync } from "@src/lib/appError";
import { Comment } from "@src/models/comment";
import { Post } from "@src/models/post";
import { User } from "@src/models/user";
import { Request, Response, NextFunction } from "express";

const addComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) return next(new AppError("Post not found", 404));

    const user = await User.findById(userId).select(
      "username displayName avatarUrl"
    );
    if (!user) return next(new AppError("User not found", 404));

    const comment = await Comment.create({
      post: post._id,
      author: user._id,
      content,
      authorSnapshot: {
        _id: user._id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
    });

    await Post.findByIdAndUpdate(post._id, { $inc: { commentCount: 1 } });

    return res.status(201).json({
      status: "success",
      data: comment,
    });
  }
);

export { addComment };
