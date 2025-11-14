import { use_prisma } from "@src/lib/prisma-client";
import { transactionParamInput } from "@src/schemas/transaction.schema";
import { catchAsync } from "@src/utils";
import { Request, Response, NextFunction } from "express";

export const deleteTransaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { transactionId } = req.params as transactionParamInput;

    await use_prisma.transaction.delete({
      where: { id: transactionId },
    });

    res.status(204).json();
  }
);
