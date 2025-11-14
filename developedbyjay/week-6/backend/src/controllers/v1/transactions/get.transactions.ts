import { use_prisma } from "@src/lib/prisma-client";
import { logger } from "@src/lib/winston-logger";
import { catchAsync } from "@src/utils";
import { NextFunction, Request, Response } from "express";

export const getTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const transactions = await use_prisma.transaction.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });

    const total = await use_prisma.transaction.count();
  
    logger.info('came here')
    res.status(200).json({
      status: "success",
      total,
      page,
      pages: Math.ceil(total / limit),
      data: transactions,
    });
  }
);
