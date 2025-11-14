import { Router } from "express";
import { body } from "express-validator";
import { User } from "@/models/user";
import { login } from "@/controllers/v1/auth/login";
import { logout } from "@/controllers/v1/auth/logout";
import { register } from "@/controllers/v1/auth/register";
import { authenticate } from "@/middleware/authentication";
import { validationError } from "@/middleware/validation";



const router = Router();

router.post(
  "/register",
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail()
    .custom(async (email,{req}) => {
    
      const user = await User.exists({ email }).exec();
      if (user) {
        throw new Error("Email already in use");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validationError,
  register
);


router.post(
  "/login",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.exists({ email }).exec();
      if (!user) {
        throw new Error("Email not found");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(async (password, { req }) => {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("+password").exec();
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error("Invalid password");
      }
      return true;
    }),
  validationError,
  login
);


router.delete("/logout", authenticate, logout);

export { router as authRouter };