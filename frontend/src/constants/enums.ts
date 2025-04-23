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
