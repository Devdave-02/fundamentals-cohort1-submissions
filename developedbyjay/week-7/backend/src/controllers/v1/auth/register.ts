import type { NextFunction, Request, Response } from "express";
import { UserRequestBody } from "@/utils/types";
import { User } from "@/models/user";
import {  catchAsync } from "@/_lib/appError";
import { generateTokens } from "@/_lib/jwt";

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password } = req.body as UserRequestBody;
    const user = await User.create({ name, email, password });
    const { accessToken } = await generateTokens(user._id, res);

    res.status(201).json({
      status: "success",
      data: { user },
      accessToken,
    });
  }
);

export { register };
