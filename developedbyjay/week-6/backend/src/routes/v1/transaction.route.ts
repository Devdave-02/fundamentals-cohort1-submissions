import { createTransaction } from "@src/controllers/v1/transactions/create.transaction";
import { deleteTransaction } from "@src/controllers/v1/transactions/delete.transaction";
import { getTransactions } from "@src/controllers/v1/transactions/get.transactions";
import { authenticate } from "@src/middleware/authenticate";
import { authorization } from "@src/middleware/authorization";
import { validator } from "@src/middleware/validator";
import { paginationSchema } from "@src/schemas/base.schema";
import {
  createTransactionSchema,
  transactionParamSchema,
} from "@src/schemas/transaction.schema";
import { Router } from "express";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorization(["admin", "user"]),
  validator(createTransactionSchema),
  createTransaction
);
router.get(
  "/",
  authorization(["admin", "user"]),
  validator(paginationSchema),
  getTransactions
);

router.delete(
  "/:transactionId",
  authorization(["admin"]),
  validator(transactionParamSchema),
  deleteTransaction
);

export { router as transactionRouter };
