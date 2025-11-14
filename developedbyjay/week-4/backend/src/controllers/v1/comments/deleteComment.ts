import type { Request, Response, NextFunction } from "express";
import { AppError, catchAsync } from "@lib/appError";
import { Comment } from "@src/models/comment";
import { Post } from "@src/models/post";

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return next(new AppError("Comment can not be found", 404));
   
    await Post.findOneAndUpdate(
      { _id: comment.post },
      {
        $inc: {
          commentCount: -1,
        },
      }
    );

    await Comment.findByIdAndDelete(commentId).exec();
    res.status(204).json({
      status: "success",
      message: "comment deleted successfully",
    });
  }
);

export { deleteComment };
