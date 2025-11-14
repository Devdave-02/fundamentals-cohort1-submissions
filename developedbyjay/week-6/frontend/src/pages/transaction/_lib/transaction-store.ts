import { createStore } from "@/lib/create-store";
import {
  transactionDefaultFilter,
  type transactionFiltersSchema,
} from "../_schema/transaction-schema";

type State = {
  transactionDialogOpen: boolean;
  transactionFilters: transactionFiltersSchema;
};

type Actions = {
  updateTransactionDialogOpen: (id: State["transactionDialogOpen"]) => void;
  //   updateTransactionFilters: (is: State["transactionFilters"]) => void;
  updateTransactionPage: (
    is: "next" | "prev" | State["transactionFilters"]["page"]
  ) => void;
  updateTransactionLimit: (is: State["transactionFilters"]["limit"]) => void;
};

type Store = State & Actions;

const useTransactionStore = createStore<Store>(
  (set) => ({
    transactionDialogOpen: false,
    transactionFilters: transactionDefaultFilter,
    updateTransactionDialogOpen: (id) =>
      set((state) => {
        state.transactionDialogOpen = id;
      }),
    updateTransactionPage: (id) =>
      set((state) => {
        const currentPage = state.transactionFilters.page;
        let newPage = currentPage;

        if (id === "next") {
          newPage = currentPage + 1;
        } else if (id === "prev") {
          newPage = Math.max(currentPage - 1, 1);
        } else if (typeof id === "number") {
          newPage = id;
        }

        state.transactionFilters.page = newPage;
      }),
    updateTransactionLimit: (id) =>
      set((state) => {
        state.transactionFilters.limit = 1;
        state.transactionFilters.limit = id;
      }),
  }),
  {
    skipPersist: true,
  }
);

export { useTransactionStore };
