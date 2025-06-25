import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tradePageContentStyles } from '../../TradePageContent/styles.ts';
import TransactionTable from '../../../components/common/TransactionTable/TransactionTable.tsx';
import { createFetchAllTransactionsByUserOptions } from '../../../constants/customQueryOptions.ts';
import { DEFAULT_ERROR_REFETCH_INTERVAL } from '../../../constants/configVariables.ts';
import { useCancelPendingTransaction } from '../../../hooks/useCancelPendingTransaction.ts';

const TransactionsHistoryContent: React.FC = () => {
  const queryClient = useQueryClient();

  const fetchedAllTransactionsResult = useQuery({
    ...createFetchAllTransactionsByUserOptions(),
    refetchInterval: (query) => {
      if (query.state.status === 'error') {
        return DEFAULT_ERROR_REFETCH_INTERVAL;
      }
      return false;
    },
  });

  const { mutateAsync: cancelPendingTransaction } = useCancelPendingTransaction();

  const handleCancelTransaction = async (transactionId: number) => {
    await cancelPendingTransaction(transactionId);
    queryClient.invalidateQueries({ queryKey: ['fetchAllTransactionsByUser'] });
  };

  return (
    <Box sx={tradePageContentStyles.pendingTransactionsContainer}>
      {fetchedAllTransactionsResult.isLoading ? (
        <CircularProgress />
      ) : (
        <TransactionTable
          data={fetchedAllTransactionsResult.data ?? []}
          pendingOnly={false}
          handleCancelTransaction={handleCancelTransaction}
        />
      )}
    </Box>
  );
};

export default TransactionsHistoryContent;
