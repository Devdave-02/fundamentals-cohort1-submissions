import { Router } from "express";
import { User } from "@models/user";
import { body } from "express-validator";
import { authenticate } from "@middlewares/authentication";
import { authorization } from "@middlewares/authorization";
import { validationError } from "@middlewares/validate";

import { getCurrentUser } from "@controllers/v1/user/profile";

import { updateCurrentUser } from "@controllers/v1/user/update-profile";

const router = Router();

router.get(
  "/current",
  authenticate,
  authorization(["user", "admin"]),
  getCurrentUser
);

router.patch(
  "/current",
  authenticate,
  authorization(["user", "admin"]),
  body("username").optional().isString().trim().isLength({ min: 2, max: 20 }),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(async (email) => {
      const duplicateEmail = await User.exists({ email }).exec();
      if (duplicateEmail) {
        throw new Error("Email already in use");
      }
    }),
  body("currentPassword")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(async (currentPassword, { req }) => {
      const userId = req.userId;
      const user = await User.findById(userId).select("+password").exec();
      if (!user) throw new Error("User not found");
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) throw new Error("Current password is incorrect");
    }),
  body("newPassword")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(async (newPassword, { req }) => {
      const userId = req.userId;
      const user = await User.findById(userId).select("+password").exec();
      const isMatch = await user!.comparePassword(newPassword);
      if (isMatch) throw new Error("Kindly choose a different password");
    }),
  body("role").not().exists().withMessage("Role cannot be changed"),
 
  validationError,
  updateCurrentUser
);

export default router;
