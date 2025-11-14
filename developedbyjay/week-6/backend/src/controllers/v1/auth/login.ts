import { catchAsync } from "@src/utils";
import { generateTokens } from "@src/lib/jwt";
import { loginInput } from "@src/schemas/user.schema";
import { use_prisma } from "@src/lib/prisma-client";
import { AppError } from "@src/lib/app-error";
import { NextFunction, Request, Response } from "express";

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body as loginInput;

    const user = await use_prisma.user.findUnique({ where: { email } });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { accessToken } = await generateTokens(user.id, res);

    res.status(200).json({
      status: "success",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  }
);
