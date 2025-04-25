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
