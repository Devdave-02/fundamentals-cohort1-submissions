import { deleteComment } from "@src/controllers/v1/comments/deleteComment";
import { updateComment } from "@src/controllers/v1/comments/updateComment";
import { authenticate } from "@src/middlewares/authentication";
import { authorization } from "@src/middlewares/authorization";
import { validationError } from "@src/middlewares/validate";
import express from "express";
import { body, param } from "express-validator";

const router = express.Router();

/**
 * @route   PATCH /api/posts/:postId
 * @desc    Update a post
 */
router.patch(
  "/:commentId",
  param("commentId").isMongoId().withMessage("Invalid Post ID"),
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  updateComment
);

/**
 * @route   DELETE /api/comments/:commentId
 * @desc    Delete a comment by ID
 */
router.delete(
  "/:commentId",
  param("commentId").isMongoId().withMessage("Invalid Comment ID"),
  validationError,
  authenticate,
  authorization(["user", "admin"]),
  deleteComment
);

export default router;
