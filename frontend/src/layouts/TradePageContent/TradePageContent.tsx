// src/layouts/TradePageContent/TradePageContent.tsx
import React, { Suspense, useEffect, useState } from 'react';
import { Box, CircularProgress, FormControlLabel, Switch, Theme, Typography } from '@mui/material';
import { tradePageContentStyles } from './styles';
import TradingForm from './TradingForm/TradingForm.tsx';
import { useTranslation } from 'react-i18next';
import { SxProps } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';
import {
  SEARCHPARAM_BOUGHT_CURRENCY,
  SEARCHPARAM_SOLD_CURRENCY,
} from '../../constants/customConstants.ts';
import ContentBoxLarge from '../../components/ui/ContentBoxLarge/ContentBoxLarge.tsx';
import CryptocurrenciesTableContent from '../CryptocurrenciesPageContent/CryptocurrenciesTableContent/CryptocurrenciesTableContent.tsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFetchAllPendingTransactionsByUserOptions,
  createFetchAllTransactionsByUserOptions,
} from '../../constants/customQueryOptions.ts';
import {
  DEFAULT_ERROR_REFETCH_INTERVAL,
  DEFAULT_PENDING_TRANSACTIONS_REFETCH_INTERVAL,
} from '../../constants/configVariables.ts';
import { useCancelPendingTransaction } from '../../hooks/useCancelPendingTransaction.ts';
import TransactionTable from '../../components/common/TransactionTable/TransactionTable.tsx';
import { cryptocurrenciesTableContentStyles } from '../CryptocurrenciesPageContent/CryptocurrenciesTableContent/styles.ts';
import { BalanceTypeEnum } from '../../constants/customEnums.ts';

const TradePageContent: React.FC = () => {
  const { t } = useTranslation(['tradePage', 'transactionTable']);
  const queryClient = useQueryClient(); //using for invalidating (thus re-fetching) selected queries
  const [isSimpleTrading, setIsSimpleTrading] = useState(true);

  // reading out query parameters from hyperlink
  const [searchParams] = useSearchParams();
  const soldCurrencyCode = searchParams.get(SEARCHPARAM_SOLD_CURRENCY);
  const boughtCurrencyCode = searchParams.get(SEARCHPARAM_BOUGHT_CURRENCY);

  const fetchedPendingTransactionsResult = useQuery({
    ...createFetchAllPendingTransactionsByUserOptions(),
    refetchInterval: (query) => {
      if (query.state.status === 'error') {
        return DEFAULT_ERROR_REFETCH_INTERVAL;
      }
      return DEFAULT_PENDING_TRANSACTIONS_REFETCH_INTERVAL;
    },
  });

  const fetchedAllTransactionsResult = useQuery({
    ...createFetchAllTransactionsByUserOptions(),
    refetchInterval: (query) => {
      if (query.state.status === 'error') {
        return DEFAULT_ERROR_REFETCH_INTERVAL;
      }
    },
  });

  const { mutateAsync: cancelPendingTransaction, isPending: isCancelTransactionPending } =
    useCancelPendingTransaction();

  const handleCancelTransaction = async (transactionId: number) => {
    // Wait for the mutation to complete and get the new (remaining) pending transactions
    const updatedPendingTransactions = await cancelPendingTransaction(transactionId);

    // Update cache for pending transactions without re-fetching the query itself (without additional API call)
    queryClient.setQueryData(['fetchAllPendingTransactionsByUser'], updatedPendingTransactions);
  };

  // Invalidate queries to trigger re-fetch when pending transactions changed
  useEffect(() => {
    if (fetchedPendingTransactionsResult.data) {
      // Invalidate balances query to trigger re-fetch e.g. in TradingForm when pending transactions changed
      queryClient.invalidateQueries({
        queryKey: ['fetchBalances', BalanceTypeEnum.AVAILABLE],
      });

      // Invalidate all transactions query to trigger re-fetch in All Transactions table when pending transactions changed
      queryClient.invalidateQueries({
        queryKey: ['fetchAllTransactionsByUser'],
      });
    }
  }, [fetchedPendingTransactionsResult.data]);

  return (
    <ContentBoxLarge>
      <Box sx={tradePageContentStyles.container}>
        {/*Trading form*/}
        <Box sx={tradePageContentStyles.sideColumn}>
          <Box sx={tradePageContentStyles.form}>
            <Typography variant="h4" sx={tradePageContentStyles.formTitle}>
              {isSimpleTrading
                ? t('switcher.simple') + ' / ' + t('switcher.exchange')
                : t('switcher.advanced') + ' / ' + t('switcher.exchange')}
            </Typography>
            <Box sx={tradePageContentStyles.switchRow}>
              <Typography
                sx={(isSimpleTrading && { color: 'silver' }) as SxProps<Theme>}
                color="primary"
              >
                {t('switcher.advanced')}
              </Typography>
              <FormControlLabel
                sx={{ m: 0 }}
                label={''}
                control={
                  <Switch
                    checked={isSimpleTrading}
                    onChange={(_, checked) => setIsSimpleTrading(checked)}
                    color="primary"
                  />
                }
              />
              <Typography
                sx={(!isSimpleTrading && { color: 'silver' }) as SxProps<Theme>}
                color="primary"
              >
                {t('switcher.simple')}
              </Typography>
            </Box>

            <TradingForm
              isSimpleTrading={isSimpleTrading}
              initialSoldCurrencyCode={soldCurrencyCode}
              initialBoughtCurrencyCode={boughtCurrencyCode}
            />
          </Box>
        </Box>

        {/*Cryptocurrencies Table*/}
        <Box sx={tradePageContentStyles.mainColumn}>
          <Suspense fallback={<CircularProgress />}>
            <CryptocurrenciesTableContent />
          </Suspense>
        </Box>
      </Box>

      {/*Pending Transactions Table*/}
      {fetchedPendingTransactionsResult.data?.length == 0 &&
      (fetchedPendingTransactionsResult.isLoading || isCancelTransactionPending) ? (
        <Box sx={tradePageContentStyles.pendingTransactionsContainer}>
          <CircularProgress />
        </Box>
      ) : fetchedPendingTransactionsResult.data &&
        fetchedPendingTransactionsResult.data.length > 0 ? (
        <Box sx={tradePageContentStyles.pendingTransactionsContainer}>
          <Typography variant="h5" sx={{ ...cryptocurrenciesTableContentStyles.title, mb: 4 }}>
            {t('transactionTable:common.headerPending')}
          </Typography>
          <TransactionTable
            data={fetchedPendingTransactionsResult.data}
            pendingOnly={true}
            handleCancelTransaction={handleCancelTransaction}
          />
        </Box>
      ) : null}

      {/*All Transactions Table*/}
      {fetchedAllTransactionsResult.data?.length == 0 && fetchedAllTransactionsResult.isLoading ? (
        <Box sx={tradePageContentStyles.pendingTransactionsContainer}>
          <CircularProgress />
        </Box>
      ) : fetchedAllTransactionsResult.data && fetchedAllTransactionsResult.data.length > 0 ? (
        <Box sx={tradePageContentStyles.pendingTransactionsContainer}>
          <Typography variant="h5" sx={{ ...cryptocurrenciesTableContentStyles.title, mb: -2 }}>
            {t('transactionTable:common.headerAll')}
          </Typography>
          <TransactionTable
            data={fetchedAllTransactionsResult.data}
            pendingOnly={false}
            handleCancelTransaction={handleCancelTransaction}
          />
        </Box>
      ) : null}
    </ContentBoxLarge>
  );
};

export default TradePageContent;
