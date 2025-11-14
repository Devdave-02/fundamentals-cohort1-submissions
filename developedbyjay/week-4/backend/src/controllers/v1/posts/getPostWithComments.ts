import { AppError, catchAsync } from "@src/lib/appError";
import { Comment } from "@src/models/comment";
import { Post } from "@src/models/post";
import { Request, Response, NextFunction } from "express";

const getPostWithComments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(50, Number(req.query.pageSize) || 10);
    const skip = (page - 1) * pageSize;

    const post = await Post.findById(postId).lean();
    if (!post) return next(new AppError("Post not found", 404));

    const comments = await Comment.find({ post: post._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    return res
      .status(200)
      .json({
        status: "success",
        message: "Post + comment fetched successfully",
        data: { post, comments, page, pageSize },
      });
  }
);

export { getPostWithComments };
