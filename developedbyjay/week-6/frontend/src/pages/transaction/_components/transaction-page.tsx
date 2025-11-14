// import { useMemo } from "react";
import { useTransaction } from "../_service/use-queries";
import { columns } from "./table-column";
import { DataTable } from "./table-data";
import { TransactionDialog } from "./transaction-dialog";

export const TransactionTable = () => {
  const transactionQuery = useTransaction();

  return (
    <div className="space-y-6">
      <TransactionDialog />
      <DataTable
        key={transactionQuery.dataUpdatedAt}
        columns={columns}
        data={transactionQuery.data?.data ?? []}
        totalPages={transactionQuery.data?.pages ?? 1}
      />
    </div>
  );
};
