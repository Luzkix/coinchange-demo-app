import { CoinsSortOrderTypeEnum, CoinsTypeEnum } from './customEnums.ts';

/**
 * Default interval for fetching coins details from coinbase api
 */
export const DEFAULT_ALL_COINS_REFRESH_INTERVAL = 3600000; //1hour (coinbase free api refreshes data once per several hours so it is sufficient)

/**
 * Maximum number of coins for fetching coins details from coinbase api
 */
export const DEFAULT_LOADED_COINS_LIMIT = 1000;

/**
 * Type of coins for fetching coins details from coinbase api
 */
export const DEFAULT_COINS_TYPE = CoinsTypeEnum.SPOT;

/**
 * Type of coins for fetching coins details from coinbase api
 */
export const DEFAULT_COINS_SORTING = CoinsSortOrderTypeEnum.VOLUME_24_DESC;

/**
 * Array of supported fiat currencies (USD, EUR, ...)
 * Values match quote_currency_id field from CoinPair model
 */
export const SUPPORTED_CURRENCIES = ['USD', 'EUR'];

/**
 * Array of supported cryptocurrencies (BTC, ETH, ...)
 * Values match base_currency_id field from CoinPair model
 */
export const SUPPORTED_COINS = [
  'BTC',
  'ETH',
  'XRP',
  'BNB',
  'SOL',
  'DOGE',
  'TRX',
  'ADA',
  'LINK',
  'AVAX',
];

/**
 * Default number of "top" coins to be displayed (e.g.Tradable,Top fainers, New on CoinChange...)
 */
export const DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED = 6;

/**
 * Default time in miliseconds for refreshing "top" coins price data (e.g.Tradable,Top fainers, New on CoinChange...)
 */
export const DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED = 5000; //10sec
