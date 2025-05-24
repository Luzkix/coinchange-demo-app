import { CoinsSortOrderTypeEnum, CoinsTypeEnum } from './customEnums.ts';

/**
 * Default interval for fetching coins details from coinbase api
 */
export const DEFAULT_ALL_COINS_REFRESH_INTERVAL = 1800000; //30 mins (coinbase free api refreshes data once per several hours so it is sufficient)

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
export const DEFAULT_FIAT_CURRENCIES = ['USD', 'EUR'];

/**
 * Array of supported cryptocurrencies (BTC, ETH, ...)
 * Values match base_currency_id field from CoinPair model
 */
export const DEFAULT_CRYPTO_CURRENCIES = [
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
 * Default number of "top" coins to be displayed (e.g.Tradeable,Top fainers, New on CoinChange...)
 */
export const DEFAUL_NO_OF_TOP_COINS_TO_BE_DISPLAYED = 6;

/**
 * Default time in miliseconds for refreshing "top" coins price data (e.g.Tradeable,Top fainers, New on CoinChange...)
 */
export const DEFAUL_REFRESH_TIME_OF_TOP_COINS_TO_BE_DISPLAYED = 5000; //milisec

/**
 * Default time in miliseconds for automatic hiding of popup error messages
 */
export const DEFAULT_ERROR_POPUP_AUTOHIDE_TIME = 4000; //milisec

/**
 * Default number of popup error messages to be displayed simultaneously
 */
export const DEFAULT_NUMBER_OF_POPUP_ERROR_MESSAGES = 6;

/**
 * Default pagination options
 */
export const DEFAUL_PAGE_SIZE_OPTIONS = [10, 30, 50];
