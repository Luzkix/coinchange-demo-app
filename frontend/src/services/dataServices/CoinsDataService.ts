import { ApiCoinPairService, CoinPair } from '../../api-generated/coinbase';
import {
  DEFAULT_COINS_SORTING,
  DEFAULT_COINS_TYPE,
  DEFAULT_LOADED_COINS_LIMIT,
  SUPPORTED_COINS,
  SUPPORTED_CURRENCIES,
} from '../../constants/configVariables.ts';
import { CoinsSortOrderTypeEnum, CoinsTypeEnum } from '../../constants/enums.ts';
import { setApiBaseToProxyUrl } from '../../../proxy-server/setApiBase.ts';

/**
 * Type definition for FetchedCoinPair specifying CoinPair and boolean defining whether CoinPair is tradable on CoinChange exchange,
 * example: {coinPair : BTC-USD CoinPair, isTradable: true}
 */
export type FetchedCoinPair = { coinPair: CoinPair; isTradable: boolean };
/**
 * Type definition for resulting map (currencies -> coins map),
 * example:
 *  (
 *  USD : (BTC : {coinPair : BTC-USD CoinPair, isTradable: true}, {coinPair : SOL-USD CoinPair, isTradable: true}, ...)
 *  EUR : (BTC : {coinPair : BTC-EUR CoinPair, isTradable: true}, {coinPair : UBT-EUR CoinPair, isTradable: false}, ...)
 *  )
 */
export type CoinsMap = Map<string, Map<string, FetchedCoinPair>>;

/**
 * Service for fetching and processing coin data from Coinbase API
 */
export class CoinsDataService {
  /**
   * Initializes the API base URLs to use proxy server
   * Call this once before making any API calls
   */
  public static initializeApi(): void {
    setApiBaseToProxyUrl(true);
  }

  /**
   * Fetches coin data from Coinbase API and transforms it into a structured map
   * organized by quote currency (USD/EUR) and fetched cryptocurrency (BTC, ETH...)
   *
   * @returns Promise returning loaded coins data organized as a CoinsMap data type
   */
  public static async fetchCoinsData(
    limit?: number,
    offset?: number,
    productType?: CoinsTypeEnum,
    productIds?: Array<string>,
    productsSortOrder?: CoinsSortOrderTypeEnum,
  ): Promise<CoinsMap> {
    try {
      // Step 1: Call the API with specified parameters or default ones if not specified
      const response = await ApiCoinPairService.getListOfCoinsWithTradingDetails(
        limit ? limit : DEFAULT_LOADED_COINS_LIMIT, // limit
        offset ? offset : undefined, // offset
        productType ? productType : DEFAULT_COINS_TYPE, // productType
        productIds ? productIds : undefined, // productIds
        productsSortOrder ? productsSortOrder : DEFAULT_COINS_SORTING, // productsSortOrder
      );

      // Step 2: Initialize the resulting map
      const resultMap: CoinsMap = new Map();

      // Initialize maps for each allowed currency
      SUPPORTED_CURRENCIES.forEach((supportedCurrency) => {
        resultMap.set(supportedCurrency, new Map<string, FetchedCoinPair>());
      });

      // Step 3: Process the response and populate the map
      if (response && response.products && response.products.length > 0) {
        response.products.forEach((coinPair) => {
          // Check if this coinPair has supported quote currency (USD or EUR or other supported currency) and supported base currency (BTC, ETH, etc.)
          if (SUPPORTED_CURRENCIES.includes(coinPair.quote_currency_id)) {
            // Get the appropriate USD/EUR... currency map
            const currencyMap = resultMap.get(coinPair.quote_currency_id);

            // set the coinPair to the appropriate currency map with proper isTradable boolean value
            if (currencyMap) {
              if (SUPPORTED_COINS.includes(coinPair.base_currency_id)) {
                currencyMap.set(coinPair.base_currency_id, {
                  coinPair: coinPair,
                  isTradable: true,
                });
              } else {
                currencyMap.set(coinPair.base_currency_id, {
                  coinPair: coinPair,
                  isTradable: false,
                });
              }
            }
          }
        });
      }

      return resultMap;
    } catch (error) {
      console.error('Error fetching coins data:', error);
      // Return empty map in case of error
      return new Map();
    }
  }
}
