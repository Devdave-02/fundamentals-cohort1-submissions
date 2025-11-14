import { useQuery } from "@tanstack/react-query";
import { getTransactions, getUsers } from "./queries";
import { useTransactionStore } from "../_lib/transaction-store";

export const useUser = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
};

export const useTransaction = () => {
  const transactionFilters = useTransactionStore(
    (state) => state.transactionFilters
  );

  console.log('came here')
  return useQuery({
    queryKey: ["transactions",transactionFilters],
    queryFn: () => getTransactions(transactionFilters),
  });
};
