import {
  DEFAULT_COINS_SORTING,
  DEFAULT_COINS_TYPE,
  DEFAULT_LOADED_COINS_LIMIT,
} from '../constants/configVariables.ts';
import { CoinsMap, FetchCoinsDataOptions } from '../constants/customTypes.ts';
import { FetchCoinPairStatsError, FetchCoinsDataError } from '../constants/customErrors.ts';
import {
  ApiCoinbaseService,
  type CoinStatsResponseDto,
  CurrencyResponseDto,
} from '../api-generated/backend';
import { convertCurrenciesToStringArrayOfCodes } from './utils/coinsUtils.ts';

/**
 * Service for fetching and processing coin data from Coinbase API
 */
export const CoinsDataService = {
  /**
   * Fetches coin data from Coinbase API and transforms it into a structured map
   * organized by quote currency (USD/EUR) and fetched cryptocurrency (BTC, ETH...)
   * @returns Promise returning loaded coins data organized as a CoinsMap data type
   */
  async fetchCoinsData(
    supportedFiatCurrencies: CurrencyResponseDto[],
    supportedCryptoCurrencies: CurrencyResponseDto[],
    options?: FetchCoinsDataOptions,
  ): Promise<CoinsMap> {
    try {
      // Step 1: Call the API with specified parameters or default ones if not specified
      console.log(`Fetching supported coins data...`);
      const response = await ApiCoinbaseService.getListOfCoinsWithTradingDetails(
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
        resultMap.set(supportedCurrency.code, new Map());
      });

      // Step 3: Process the response and populate the map
      if (response && response.products && response.products.length > 0) {
        response.products.forEach((coinPair) => {
          // Check if this coinPair has supported quote currency (USD or EUR or other supported currency) and supported base currency (BTC, ETH, etc.)
          if (
            convertCurrenciesToStringArrayOfCodes(supportedFiatCurrencies).includes(
              coinPair.quote_currency_id,
            )
          ) {
            // Get the appropriate USD/EUR... currency map
            const currencyMap = resultMap.get(coinPair.quote_currency_id);
            // set the coinPair to the appropriate currency map with proper isTradeable boolean value
            if (currencyMap) {
              if (
                convertCurrenciesToStringArrayOfCodes(supportedCryptoCurrencies).includes(
                  coinPair.base_currency_id,
                )
              ) {
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

      console.log('Coins data loaded successfully, CoinsMap created');
      return resultMap;
    } catch (error) {
      const message = 'Failed to fetch coins data';
      console.log(message);

      throw new FetchCoinsDataError(
        message,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },

  /**
   * Fetches statistics for a specific coin pair by productId
   */
  async fetchCoinPairStats(productId: string): Promise<CoinStatsResponseDto> {
    try {
      console.log(`Fetching supported coin pair stats for ${productId} ...`);
      return await ApiCoinbaseService.getCoinStats(productId);
    } catch (error) {
      const message = `Failed to fetch stats for ${productId}`;
      console.log(message);

      throw new FetchCoinPairStatsError(
        productId,
        message,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },
};
