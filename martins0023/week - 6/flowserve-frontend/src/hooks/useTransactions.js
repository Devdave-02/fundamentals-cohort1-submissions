import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as transactionApi from '../api/transactions.api';
import { toast } from 'react-hot-toast';

/**
 * Custom hook to create a new transfer.
 * Handles success/error notifications and cache invalidation.
 */
export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.createTransfer,
    onSuccess: (data) => {
      toast.success(`Transfer of $${data.amount} successful!`);
      
      // When a transfer is successful, we must refetch user data
      // to show their updated balances.
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // We also refetch transactions for the involved users
      queryClient.invalidateQueries({ queryKey: ['transactions', data.senderId] });
      queryClient.invalidateQueries({ queryKey: ['transactions', data.receiverId] });
    },
    onError: (error) => {
      // The error message comes from our apiClient interceptor
      toast.error(error.message);
    },
  });
};

/**
 * Custom hook to fetch transactions for a user.
 * @param {string} userId - The user's ID.
 */
export const useGetTransactions = (userId) => {
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => transactionApi.getTransactionsForUser(userId),
    enabled: !!userId, // Only run if userId is provided
  });
};
