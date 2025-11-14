import { executeActions } from "@/lib/execute-action";
import { apiClient } from "@/lib/request";
import { redirect } from "react-router-dom";
import type {
  transactionFiltersSchema,
  TransactionsResponse,
} from "../_schema/transaction-schema";
import type { UsersResponse } from "../_schema/user-schema";

export const getUsers = async (): Promise<UsersResponse> => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) redirect("/login");
  return await executeActions({
    actionFn: () => apiClient.get<UsersResponse>("/user", accessToken!),
  });
};

export const getTransactions = async (
  filters: transactionFiltersSchema
): Promise<TransactionsResponse> => {
  console.log('fetching data')
  const { page, limit } = filters;
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) redirect("/login");
  return await executeActions({
    actionFn: () =>
      apiClient.get<TransactionsResponse>(
        `/transaction?page=${page ? page : 1}&limit=${limit ? limit : 5}`,
        accessToken!
      ),
  });
};
