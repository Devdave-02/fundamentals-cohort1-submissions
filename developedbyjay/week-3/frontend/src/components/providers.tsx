"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./ui/sonner";
import { AlertDialogProvider } from "./alert-dialog-provider";
import { toast } from "sonner";
type ProvidersProps = {
  children: ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        if (error.message === "NEXT_REDIRECT") return;
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Operation successful.");
      },
    },
  },
});

const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      <AlertDialogProvider />
    </QueryClientProvider>
  );
};

export { Providers };
