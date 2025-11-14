import { executeActions } from "@/lib/execute-action";
import {
  transactionSchema,
  type TransactionSchema,
} from "../_schema/transaction-schema";
import { apiClient } from "@/lib/request";

export const createTransaction = async (data: TransactionSchema) => {
  const accessToken = localStorage.getItem("accessToken");
  const validatedData = transactionSchema.parse(data);
  return executeActions({
    actionFn: () =>
      apiClient.post(
        "/transaction/",
        {
          userId: validatedData.userId,
          description: validatedData.description,
          amount: validatedData.amount,
          type: validatedData.type,
        },
        accessToken!
      ),
  });
};
