import type { NextFunction, Request, Response } from "express";
import { UserRequestBody } from "@utils/index";
import { User } from "@models/user";
import { AppError, catchAsync } from "@lib/appError";
import { generateTokens } from "@lib/jwt";

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, email, password, role } = req.body as UserRequestBody;
    if (role === "admin" && !process.env.WHITELIST_EMAILS?.includes(email)) {
      return next(
        new AppError("You are not allowed to register as admin", 400)
      );
    }
    const user = await User.create({ username, email, password, role });
    const { accessToken } = await generateTokens(user._id, res);

    res.status(201).json({
      status: "success",
      data: { user },
      accessToken,
    });
  }
);

export { register };
