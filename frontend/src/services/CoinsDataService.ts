import { ApiCoinPairService } from '../api-generated/coinbase';
import {
  DEFAULT_COINS_SORTING,
  DEFAULT_COINS_TYPE,
  DEFAULT_LOADED_COINS_LIMIT,
} from '../constants/configVariables.ts';
import { CoinsMap, FetchCoinsDataOptions } from '../constants/customTypes.ts';
import { ApiCoinStatsService, CoinStats } from '../api-generated/coinbase-exchange';
import {
  FetchCoinsDataError,
  FetchCoinStatsError,
  FetchMarketConversionRateError,
  FetchSupportedCurrenciesError,
} from '../constants/customErrors.ts';
import {
  ApiCurrencyService,
  type CurrencyConversionRateResponseDto,
  CurrencyResponseDto,
} from '../api-generated/backend';
import { useGeneralContext } from '../contexts/GeneralContext.tsx';

/**
 * Service for fetching and processing coin data from Coinbase API
 */
export const CoinsDataService = {
  /**
   * Fetches coin data from Coinbase API and transforms it into a structured map
   * organized by quote currency (USD/EUR) and fetched cryptocurrency (BTC, ETH...)
   * @returns Promise returning loaded coins data organized as a CoinsMap data type
   */
  async fetchCoinsData(options?: FetchCoinsDataOptions): Promise<CoinsMap> {
    const { supportedFiatCurrencies, supportedCryptoCurrencies } = useGeneralContext();

    try {
      // Step 1: Call the API with specified parameters or default ones if not specified
      const response = await ApiCoinPairService.getListOfCoinsWithTradingDetails(
        options && options.limit ? options.limit : DEFAULT_LOADED_COINS_LIMIT, // limit
        options && options.offset ? options.offset : undefined, // offset
        options && options.productType ? options.productType : DEFAULT_COINS_TYPE, // productType
        options && options.productIds ? options.productIds : undefined, // productIds
        options && options.productsSortOrder ? options.productsSortOrder : DEFAULT_COINS_SORTING, // productsSortOrder
      );

      // Step 2: Initialize the resulting map
      const resultMap: CoinsMap = new Map();
      // Initialize maps for each allowed currency
      supportedFiatCurrencies.forEach((supportedCurrency) => {
        resultMap.set(supportedCurrency, new Map());
      });

      // Step 3: Process the response and populate the map
      if (response && response.products && response.products.length > 0) {
        response.products.forEach((coinPair) => {
          // Check if this coinPair has supported quote currency (USD or EUR or other supported currency) and supported base currency (BTC, ETH, etc.)
          if (supportedFiatCurrencies.includes(coinPair.quote_currency_id)) {
            // Get the appropriate USD/EUR... currency map
            const currencyMap = resultMap.get(coinPair.quote_currency_id);
            // set the coinPair to the appropriate currency map with proper isTradeable boolean value
            if (currencyMap) {
              if (supportedCryptoCurrencies.includes(coinPair.base_currency_id)) {
                currencyMap.set(coinPair.base_currency_id, {
                  coinPair: coinPair,
                  isTradeable: true,
                });
              } else {
                currencyMap.set(coinPair.base_currency_id, {
                  coinPair: coinPair,
                  isTradeable: false,
                });
              }
            }
          }
        });
      }

      console.log('Refreshed CoinsMap loaded');
      return resultMap;
    } catch (error) {
      throw new FetchCoinsDataError(
        'Failed to fetch coins data',
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },

  /**
   * Fetches statistics for a specific coin pair by productId
   */
  async fetchCoinPairStats(productId: string): Promise<CoinStats> {
    try {
      return await ApiCoinStatsService.getCoinStats(productId);
    } catch (error) {
      throw new FetchCoinStatsError(
        productId,
        `Failed to fetch stats for ${productId}`,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },

  /**
   * Fetches both fiat/crypto currencies which are allowed to be used for trading
   */
  async fetchSupportedCurrencies(): Promise<CurrencyResponseDto[]> {
    try {
      console.log('Fetching supported currencies from backend');
      return await ApiCurrencyService.getSupportedCurrencies();
    } catch (error) {
      throw new FetchSupportedCurrenciesError(
        `Failed to fetch supported currencies`,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },

  /**
   * Fetches backend validated market conversion rate for a pair of sold/bought currencies
   */
  async fetchMarketConversionRate(
    soldCurrencyCode: string,
    boughtCurrencyCode: string,
  ): Promise<CurrencyConversionRateResponseDto> {
    try {
      console.log('Fetching market conversion rate from backend');
      return await ApiCurrencyService.getMarketConversionRate(soldCurrencyCode, boughtCurrencyCode);
    } catch (error) {
      throw new FetchMarketConversionRateError(
        `Failed to fetch supported currencies`,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },
};
