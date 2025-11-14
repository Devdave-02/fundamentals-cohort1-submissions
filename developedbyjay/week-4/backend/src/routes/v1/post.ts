import { addComment } from "@src/controllers/v1/comments/createComent";
import { createPost } from "@src/controllers/v1/posts/createPost";
import { deletePost } from "@src/controllers/v1/posts/deletePost";
import { getFeeds } from "@src/controllers/v1/posts/getFeeds";
import { getPostWithComments } from "@src/controllers/v1/posts/getPostWithComments";
import { updatePost } from "@src/controllers/v1/posts/updatePost";
import { authenticate } from "@src/middlewares/authentication";
import { authorization } from "@src/middlewares/authorization";
import { validationError } from "@src/middlewares/validate";
import express from "express";
import { body, param, query } from "express-validator";

const router = express.Router();

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 */

router.post(
  "/",
  body("content").trim().notEmpty().withMessage("Post content is required"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  createPost
);

/**
 * @route   GET /api/posts
 * @desc    Get all posts/feeds
 */

router.get(
  "/",
  query("page")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("page must be between 1 to 100"),
  query("pageSize").optional().isInt({ min: 0 }),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  getFeeds
);

/**
 * @route   GET /api/posts/:postId
 * @desc    Get a single post by ID
 */
router.get(
  "/:postId",
  query("page")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("page must be between 1 to 100"),
  query("pageSize").optional().isInt({ min: 0 }),
  param("postId").isMongoId().withMessage("Invalid Post ID"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  getPostWithComments
);

/**
 * @route   PATCH /api/posts/:postId
 * @desc    Update a post
 */
router.patch(
  "/:postId",
  param("postId").isMongoId().withMessage("Invalid Post ID"),
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  updatePost
);

/**
 * @route   DELETE /api/posts/:postId
 * @desc    Delete a post
 */
router.delete(
  "/:postId",
  param("postId").isMongoId().withMessage("Invalid Post ID"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  deletePost
);

/**
 * @route   POST /api/posts/:postId/comments
 * @desc    Add a comment to a post
 */
router.post(
  "/:postId/comment",
  param("postId").isMongoId().withMessage("Invalid Post ID"),
  body("content").trim().notEmpty().withMessage("Comment content is required"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  addComment
);

export default router;
