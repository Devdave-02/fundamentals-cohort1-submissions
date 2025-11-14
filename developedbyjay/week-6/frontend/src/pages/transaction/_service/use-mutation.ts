import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransactionSchema } from "../_schema/transaction-schema";
import { createTransaction } from "./mutations";
import { toast } from "sonner";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TransactionSchema) => {
      await createTransaction(data);
    },
    onSuccess: () => {
      toast.success("Transaction created successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
