import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "@utils/index";
import { User } from "@models/user";
import { AppError } from "@lib/appError";
import { generateTokens } from "@lib/jwt";
import { UserRequestBody } from "@src/utils/types";

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password, role } = req.body as UserRequestBody;
    if (role === "admin" && !process.env.WHITELIST_EMAILS?.includes(email)) {
      return next(
        new AppError("You are not allowed to register as admin", 400)
      );
    }
    const user = await User.create({ name, email, password, role });
    const { accessToken } = await generateTokens(user._id, res);

    res.status(201).json({
      status: "success",
      data: { user },
      accessToken,
    });
  }
);

export { register };
