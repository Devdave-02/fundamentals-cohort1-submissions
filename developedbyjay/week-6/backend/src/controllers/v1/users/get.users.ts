import { use_prisma } from "@src/lib/prisma-client";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await use_prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const total = await use_prisma.user.count();

    res.status(200).json({
      status: "success",
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users,
    });
  }
);
