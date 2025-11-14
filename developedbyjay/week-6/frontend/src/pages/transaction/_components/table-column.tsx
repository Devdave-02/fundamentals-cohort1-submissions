import { type ColumnDef } from "@tanstack/react-table";
import type { Transaction } from "../_schema/transaction-schema";


export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "user.name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
