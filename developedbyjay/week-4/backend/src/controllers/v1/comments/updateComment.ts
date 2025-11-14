import type { Request, Response, NextFunction } from "express";
import { AppError, catchAsync } from "@src/lib/appError";
import { User } from "@src/models/user";
import { Comment } from "@src/models/comment";

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { commentId } = req.params;
    const content = req.body;

    const user = await User.findById(userId).lean()
    if (!user) return next(new AppError("User can not be found", 404));

    const comment = await Comment.findByIdAndUpdate(commentId, content, {
      new: true,
    });

    return res.status(201).json({
      status: "success",
      message: "comment updated successfully",
      data: comment,
    });
  }
);

export { updateComment };
