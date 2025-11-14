import { z } from "zod";

export const transactionParamSchema = z.object({
  params: z.object({
    transactionId: z.string().min(1, "Transaction ID is required"),
  }),
});

export const createTransactionSchema = z.object({
  body: z.object({
    userId: z.string(),
    type: z.enum(["credit", "debit"], { message: "Type is not recognized" }),
    amount: z.coerce.number(),
    description: z.string().min(4, { message: "minimum value is 4" }),
  }),
});

export type createTransactionInput = z.infer<
  typeof createTransactionSchema
>["body"];

export type transactionParamInput = z.infer<
  typeof transactionParamSchema
>["params"];
