import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTransactionStore } from "../_lib/transaction-store";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import {
  transactionDefaultValues,
  transactionSchema,
  type TransactionSchema,
} from "../_schema/transaction-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select";
import { ControlledTextArea } from "@/components/ui/controlled/controlled-textarea";
import { useUser } from "../_service/use-queries";
import { ControlledInput } from "@/components/ui/controlled/controlled-input";
import { useCreateTransaction } from "../_service/use-mutation";

export const TransactionDialog = () => {
  const { transactionDialogOpen, updateTransactionDialogOpen } =
    useTransactionStore();

  const usersQuery = useUser();
  const createTransactionMutation = useCreateTransaction();

  const isPending = usersQuery.isPending || createTransactionMutation.isPending;

  const form = useForm<TransactionSchema>({
    defaultValues: transactionDefaultValues,
    resolver: zodResolver(transactionSchema),
  });

  const handleDialogOpenChange = (open: boolean) => {
    updateTransactionDialogOpen(open);
    if (!open) {
      form.reset(transactionDefaultValues);
    }
  };

  const handleSuccess = () => {
    handleDialogOpenChange(false);
  };
  const onSubmit: SubmitHandler<TransactionSchema> = (data) => {
    createTransactionMutation.mutate(data, {
      onSuccess: handleSuccess,
    });
  };

  return (
    <Dialog open={transactionDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" /> New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full" aria-describedby="transaction">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Transaction</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormProvider {...form}>
            <div className="grid gap-x-4 grid-cols-2 space-y-4">
              <div>
                <ControlledSelect<TransactionSchema>
                  name="userId"
                  label="Select the user"
                  placeholder="Select user"
                  options={usersQuery.data?.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </div>

              <div>
                <ControlledSelect<TransactionSchema>
                  name="type"
                  label="Select the type"
                  placeholder="credit"
                  options={[
                    { name: "Debit", id: "debit" },
                    { name: "Credit", id: "credit" },
                  ].map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </div>
              <div>
                <ControlledInput<TransactionSchema>
                  name="amount"
                  label="Amount"
                  type="number"
                />
              </div>
              <div className="col-span-2">
                <ControlledTextArea<TransactionSchema>
                  name="description"
                  label="Reason for transaction"
                />
              </div>
            </div>
          </FormProvider>
          <DialogFooter>
            <Button type="submit" isLoading={isPending}>
              Create Transactioon
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
