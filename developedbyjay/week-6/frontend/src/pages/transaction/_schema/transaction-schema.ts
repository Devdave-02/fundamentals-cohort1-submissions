import z from "zod";
import type { PaginatedResponse } from "@/lib/types";

export const transactionSchema = z.object({
  userId: z.string(),
  type: z.enum(["debit", "credit"]),
  amount: z.number(),
  description: z.string(),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;

export const transactionDefaultValues: TransactionSchema = {
  userId: "",
  type: "credit",
  amount: 0,
  description: "",
};

type transactionFiltersSchema = {
  page: number;
  limit: number;
};

export const transactionDefaultFilter = {
  page: 1,
  limit: 5,
};

export interface Transaction {
  id: string;
  userId: string;
  user: {
    name: string;
  };
  type: "credit" | "debit";
  amount: number;
  description: string;
  createdAt: string;
}

export type TransactionsResponse = PaginatedResponse<Transaction>;

export { type transactionFiltersSchema };
