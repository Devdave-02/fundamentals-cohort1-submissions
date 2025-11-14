import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "@lib/appError";
import { Post } from "@src/models/post";

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId).exec();

    res.status(204).json({
      status: "success",
      message: "Post deleted successfully",
    });
  }
);

export { deletePost };
