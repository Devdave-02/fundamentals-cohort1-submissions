import type { Request, Response, NextFunction } from "express";

import { AppError } from "@src/lib/app-error";
import { use_prisma } from "@src/lib/prisma-client";
import { logger } from "@src/lib/winston-logger";

type Role = "user" | "admin";

const authorization = (role: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    if (!userId) {
      return next(
        new AppError("Unauthorized, Please Login to your account", 401)
      );
    }
    const user = await use_prisma.user.findUnique({ where: { id: userId } });


    if (!user || !role.includes(user.role)) {
      return next(
        new AppError("Forbidden, you can not perform this operation", 403)
      );
    }

    next();
  };
};

export { authorization };
