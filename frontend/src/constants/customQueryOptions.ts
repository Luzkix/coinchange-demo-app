import { queryOptions } from '@tanstack/react-query';
import { FetchCoinsDataOptions } from './customTypes.ts';
import {
  DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED,
  DEFAULT_ALL_COINS_REFRESH_INTERVAL,
} from './configVariables.ts';
import { CoinsDataService } from '../services/CoinsDataService.ts';

export const creteFetchCoinsDataOptions = (fetchCoinsDataOptions?: FetchCoinsDataOptions) => {
  return queryOptions({
    queryKey: ['fetchCoinsData', fetchCoinsDataOptions],
    queryFn: () => CoinsDataService.fetchCoinsData(fetchCoinsDataOptions),
    // caching setup
    gcTime: DEFAULT_ALL_COINS_REFRESH_INTERVAL, // gcTime should not be less than staleTime otherwise when component is unmounted and later remounted the data may be fetched again before time specified by staleTime
    staleTime: DEFAULT_ALL_COINS_REFRESH_INTERVAL, // Defines how long the data should be considered "fresh"
    refetchInterval: DEFAULT_ALL_COINS_REFRESH_INTERVAL, // Automatically fetches new data so it is already pre-fetched when requested + automatically reloads components which use fetched data
  });
};

export const createFetchCoinPairStatsOptions = (productId: string) => {
  return queryOptions({
    queryKey: ['fetchCoinPairStats', productId],
    queryFn: () => CoinsDataService.fetchCoinPairStats(productId),
    // caching setup
    gcTime: DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED, // gcTime should not be less than staleTime otherwise when component is unmounted and later remounted the data may be fetched again before time specified by staleTime
    staleTime: DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED, // Defines how long the data should be considered "fresh"
  });
};
