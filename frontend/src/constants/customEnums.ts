/**
 * Enum representing possible sorting when fetching coins details from coinbase api
 */
export enum CoinsSortOrderTypeEnum {
  UNDEFINED = 'PRODUCTS_SORT_ORDER_UNDEFINED',
  VOLUME_24_DESC = 'PRODUCTS_SORT_ORDER_VOLUME_24H_DESCENDING',
  TIME_DESC = 'PRODUCTS_SORT_ORDER_LIST_TIME_DESCENDING',
}

/**
 * Enum representing type of cryptocurrency for fetching coins details from coinbase api
 */
export enum CoinsTypeEnum {
  SPOT = 'SPOT',
  FUTURE = 'FUTURE',
}

/**
 * Enum representing type of currency
 */
export enum CurrencyTypeEnum {
  FIAT = 'F',
  CRYPTO = 'C',
}

/**
 * Enum defining color of tradeable coins
 */
export enum CoinsDefaultColorEnum {
  BTC = '#F7931A',
  ETH = '#627EEA',
  XRP = '#000000',
  BNB = '#F0B90B',
  SOL = '#14F195',
  DOGE = '#C3A634',
  TRX = '#E60815',
  ADA = '#0033AD',
  LINK = '#2A5ADA',
  AVAX = '#E84142',
}

/**
 * Enum defining color of tradeable coins
 */
export enum SupportedLanguageEnum {
  ENGLISH = 'EN',
  CZECH = 'CS',
}

export enum CoinsFilterType {
  ALL = 'all',
  TRADEABLE = 'tradeable',
  NEW = 'new',
  GAINERS = 'gainers',
  LOSERS = 'losers',
}
