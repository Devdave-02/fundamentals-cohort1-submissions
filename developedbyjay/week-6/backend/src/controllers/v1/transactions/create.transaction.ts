import { use_prisma } from "@src/lib/prisma-client";
import { createTransactionInput } from "@src/schemas/transaction.schema";
import { catchAsync } from "@src/utils";
import { Request, Response, NextFunction } from "express";

export const createTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const { amount, type, description, userId } =
      req.body as createTransactionInput;

    const transaction = await use_prisma.transaction.create({
      data: { amount, type, userId, description },
    });

    res.status(201).json({
      status: "success",
      data: transaction,
    });
  }
);
