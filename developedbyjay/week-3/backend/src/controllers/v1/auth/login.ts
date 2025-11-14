import { User } from "@src/models/user";
import type { Request, Response, NextFunction } from "express";
import { generateTokens } from "@lib/jwt";
import { AppError, catchAsync } from "@lib/appError";
import { TokenPayload, UserLoginRequestBody } from "@utils/types";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body as UserLoginRequestBody;

    if (!email || !password)
      return next(new AppError("Email and password are required", 400));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email))
      return next(new AppError("Invalid email format", 400));

    const user = await User.findOne({ email }).select("+password").exec();

    if (!user) return next(new AppError("Incorrect email or password", 401));

    if (user.isLocked) {
      return next(new AppError("Account is locked. Try again in 30mins", 403));
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      await user.incrementFailedLogins();
      return next(new AppError("Incorrect email or password", 401));
    }

    await user.resetFailedLogins();

    const { accessToken } = await generateTokens(
      user._id as TokenPayload["userId"],
      res
    );

    res.status(200).json({
      status: "success",
      user,
      accessToken,
    });
  }
);
export { login };
