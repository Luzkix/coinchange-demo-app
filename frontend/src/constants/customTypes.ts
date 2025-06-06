import { CoinPair } from '../api-generated/coinbase';
import { CoinsSortOrderTypeEnum, CoinsTypeEnum } from './customEnums.ts';

/**
 * Type for storing basic data about languages. Properties are:
 * id (cs), engName (Czech), localizedName (Čeština), languageCountryCode (cs-CZ), currency (CZK)
 */
export type Language = {
  id: string;
  engName: string;
  localizedName: string;
  languageCountryCode: string;
  currency: string;
};

/**
 * Type definition for FetchedCoinPair specifying CoinPair and boolean defining whether CoinPair is tradeable on CoinChange exchange,
 * example: {coinPair : BTC-USD CoinPair, isTradeable: true}
 */
export type FetchedCoinPair = { coinPair: CoinPair; isTradeable: boolean };

/**
 * Type definition for resulting map (currencies -> coins map),
 * example:
 *  (
 *  USD : (BTC : {coinPair : BTC-USD CoinPair, isTradeable: true}, {coinPair : SOL-USD CoinPair, isTradeable: true}, ...)
 *  EUR : (BTC : {coinPair : BTC-EUR CoinPair, isTradeable: true}, {coinPair : UBT-EUR CoinPair, isTradeable: false}, ...)
 *  )
 */
export type CoinsMap = Map<string, Map<string, FetchedCoinPair>>;

export interface FetchCoinsDataOptions {
  limit?: number;
  offset?: number;
  productType?: CoinsTypeEnum;
  productIds?: Array<string>;
  productsSortOrder?: CoinsSortOrderTypeEnum;
}
