import { use_prisma } from "@src/lib/prisma-client";
import { logger } from "@src/lib/winston-logger";
import { catchAsync } from "@src/utils";
import { Request, Response, NextFunction } from "express";

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    await use_prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).json({
      message: "User successfully deleted",
    });
  }
);
