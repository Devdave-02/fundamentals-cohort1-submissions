import { AppError } from "@src/lib/app-error";
import { generateTokens } from "@src/lib/jwt";
import { use_prisma } from "@src/lib/prisma-client";
import { logger } from "@src/lib/winston-logger";
import { signUpInput } from "@src/schemas/user.schema";
import { catchAsync, hashPassword } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body as signUpInput;
    logger.info("came here");

    if (
      role === "admin" &&
      process.env.WHITELIST_ADMINS_EMAIL &&
      !process.env.WHITELIST_ADMINS_EMAIL.includes(email)
    ) {
      return next(
        new AppError("You are not allowed to register as Admin", 403)
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await use_prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const { accessToken } = await generateTokens(newUser.id, res);

    res.status(201).json({
      status: "success",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info(`User registered successfully: ${newUser.email}`);
  }
);
