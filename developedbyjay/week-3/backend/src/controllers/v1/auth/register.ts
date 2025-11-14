import type { NextFunction, Request, Response } from "express";
import { TokenPayload, UserRequestBody } from "@utils/types";
import { User } from "@models/user";
import { AppError, catchAsync } from "@lib/appError";
import { generateTokens } from "@lib/jwt";

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password, role } = req.body as UserRequestBody;
    if (role === "admin" && !process.env.WHITELIST_EMAILS?.includes(email)) {
      return next(
        new AppError("You are not allowed to register as admin", 400)
      );
    }

    if (!name || !email || !password) {
      return next(new AppError("Name, email and password are required", 400));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError("Invalid email format", 400));
    }
    if (password.length < 8) {
      return next(new AppError("Password must be at least 8 characters", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already in use", 400));
    }
    const user = await User.create({ name, email, password, role });

    const { accessToken } = await generateTokens(
      user._id as TokenPayload["userId"],
      res
    );

    res.status(201).json({
      status: "success",
      user,
      accessToken,
    });
  }
);

export { register };
