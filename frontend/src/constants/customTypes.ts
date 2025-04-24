import { CoinPair } from '../api-generated/coinbase';

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
