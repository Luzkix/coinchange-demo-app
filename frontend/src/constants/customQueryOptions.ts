import { queryOptions } from '@tanstack/react-query';
import { FetchCoinsDataOptions } from './customTypes.ts';
import {
  DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED,
  DEFAULT_ALL_COINS_REFRESH_INTERVAL,
} from './configVariables.ts';
import { CoinsDataService } from '../services/CoinsDataService.ts';
import { BalanceTypeEnum } from './customEnums.ts';
import { BalanceService } from '../services/BalanceService.ts';
import { CurrencyResponseDto } from '../api-generated/backend';
import { CurrencyService } from '../services/CurrencyService.ts';

export const creteFetchCoinsDataOptions = (
  supportedFiatCurrencies: CurrencyResponseDto[],
  supportedCryptoCurrencies: CurrencyResponseDto[],
  fetchCoinsDataOptions?: FetchCoinsDataOptions,
) => {
  return queryOptions({
    queryKey: [
      'fetchCoinsData',
      supportedFiatCurrencies,
      supportedCryptoCurrencies,
      fetchCoinsDataOptions,
    ],
    queryFn: () =>
      CoinsDataService.fetchCoinsData(
        supportedFiatCurrencies,
        supportedCryptoCurrencies,
        fetchCoinsDataOptions,
      ),
    // caching setup
    gcTime: DEFAULT_ALL_COINS_REFRESH_INTERVAL - 1000, // gcTime should not be less than staleTime otherwise when component is unmounted and later remounted the data may be fetched again before time specified by staleTime
    staleTime: DEFAULT_ALL_COINS_REFRESH_INTERVAL - 1000, // Defines how long the data should be considered "fresh"
    refetchInterval: () => DEFAULT_ALL_COINS_REFRESH_INTERVAL, // Automatically fetches new data so it is already pre-fetched when requested + automatically reloads components which use fetched data. Note: using function which ensures that automatic interval fetching will be done even after error occurs
  });
};

export const createFetchCoinPairStatsOptions = (productId: string) => {
  return queryOptions({
    queryKey: [productId],
    queryFn: () => CoinsDataService.fetchCoinPairStats(productId),
    // caching setup
    gcTime: DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED - 1000, // gcTime should not be less than staleTime otherwise when component is unmounted and later remounted the data may be fetched again before time specified by staleTime
    staleTime: DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED - 1000, // Defines how long the data should be considered "fresh"
  });
};

export const createFetchSupportedCurrenciesOptions = () =>
  queryOptions({
    queryKey: ['fetchSupportedCurrencies'],
    queryFn: () => CurrencyService.fetchSupportedCurrencies(),
    // caching setup
    gcTime: DEFAULT_ALL_COINS_REFRESH_INTERVAL - 1000, // gcTime should not be less than staleTime otherwise when component is unmounted and later remounted the data may be fetched again before time specified by staleTime
    staleTime: DEFAULT_ALL_COINS_REFRESH_INTERVAL - 1000, // Defines how long the data should be considered "fresh"
    refetchInterval: () => DEFAULT_ALL_COINS_REFRESH_INTERVAL, // Automatically fetches new data so it is already pre-fetched when requested + automatically reloads components which use fetched data. Note: using function which ensures that automatic interval fetching will be done even after error occurs
  });

export const createFetchBalancesOptions = (balanceType: BalanceTypeEnum) =>
  queryOptions({
    queryKey: ['fetchBalances', balanceType],
    queryFn: () => BalanceService.fetchBalances(balanceType),
  });

export const createFetchMarketConversionRateOptions = (
  soldCurrencyCode: string,
  boughtCurrencyCode: string,
) =>
  queryOptions({
    queryKey: ['fetchMarketConversionRate', soldCurrencyCode, boughtCurrencyCode],
    queryFn: () => CurrencyService.fetchMarketConversionRate(soldCurrencyCode, boughtCurrencyCode),
  });
