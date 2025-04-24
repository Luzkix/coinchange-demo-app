/**
 * Enum representing possible sorting when fetching details from coinbase api
 */
export enum CoinsSortOrderTypeEnum {
  UNDEFINED = 'PRODUCTS_SORT_ORDER_UNDEFINED',
  VOLUME_24_DESC = 'PRODUCTS_SORT_ORDER_VOLUME_24H_DESCENDING',
  TIME_DESC = 'PRODUCTS_SORT_ORDER_LIST_TIME_DESCENDING',
}

/**
 * Enum representing type of cryptocurrency for fetching details from coinbase api
 */
export enum CoinsTypeEnum {
  SPOT = 'SPOT',
  FUTURE = 'FUTURE',
}

/**
 * Enum defining color of tradable coins
 */
export enum CoinsColorEnum {
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
