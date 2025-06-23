import { useMutation } from '@tanstack/react-query';
import { ApiError } from '../api-generated/backend';
import { useProcessApiError } from './useProcessApiError.ts';
import { TransactionService } from '../services/TransactionService.ts';

export const useCancelPendingTransaction = () => {
  const processApiError = useProcessApiError();
  const processName = useCancelPendingTransaction.name;

  return useMutation({
    mutationFn: TransactionService.cancelPendingTransaction,
    onError: (apiError: ApiError) => {
      processApiError(apiError, processName);
    },
  });
};
