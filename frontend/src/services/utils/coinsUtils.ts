import { CoinsDefaultColorEnum } from '../../constants/customEnums.ts';
import { CoinPair } from '../../api-generated/coinbase';
import { CoinsMap } from '../../constants/customTypes.ts';

/**
 * Returns color for specified coin symbol from CoinsColorEnum.
 * If symbol is not found, returns random hex color.
 * @param coinSymbol - Symbol of the coin (e.g. 'BTC', 'ETH')
 * @returns Hex color string in format #RRGGBB
 */
export const createCoinColor = (coinSymbol: string): string => {
  // collect all keys from CoinsColorEnum (enum contains all coins with predefined colors)
  const coinsWithDefaultColor = Object.keys(
    CoinsDefaultColorEnum,
  ) as (keyof typeof CoinsDefaultColorEnum)[];

  // find coinSymbol in enum (case-insensitive)
  const foundSymbol = coinsWithDefaultColor.find(
    (predefinedCoin) => predefinedCoin.toLowerCase() === coinSymbol.toLowerCase(),
  );

  // if symbol found, return related color
  if (foundSymbol) {
    return CoinsDefaultColorEnum[foundSymbol];
  }

  // otherwise generate random color in hex format
  return (
    '#' +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')
      .toUpperCase()
  );
};

/**
 * Returns array of tradable CoinPairs for specified currency sorted by 24h volume
 * @param fetchedCoinsData - Data from CoinsDataService
 * @param currency - Target currency (USD/EUR)
 * @returns Array of CoinPair sorted by volume descending
 */
export const getTradableCoins = (fetchedCoinsData: CoinsMap, currency: string): CoinPair[] => {
  const currencyData = fetchedCoinsData.get(currency);
  if (!currencyData) return [];

  return Array.from(currencyData.entries())
    .filter(([_, { isTradable }]) => isTradable)
    .map(([_, { coinPair }]) => coinPair)
    .sort((a, b) => {
      const volumeA = Number(a.approximate_quote_24h_volume || 0);
      const volumeB = Number(b.approximate_quote_24h_volume || 0);
      return volumeB - volumeA;
    });
};

/**
 * Returns array of all CoinPairs for specified currency sorted by 24h price change
 * @param fetchedCoinsData - Data from CoinsDataService
 * @param currency - Target currency (USD/EUR)
 * @returns Array of CoinPair sorted by price change descending
 */
export const getTopGainers = (fetchedCoinsData: CoinsMap, currency: string): CoinPair[] => {
  const currencyData = fetchedCoinsData.get(currency);
  if (!currencyData) return [];

  return Array.from(currencyData.values())
    .map(({ coinPair }) => coinPair)
    .sort((a, b) => {
      const changeA = Number(a.price_percentage_change_24h || 0);
      const changeB = Number(b.price_percentage_change_24h || 0);
      return changeB - changeA;
    });
};

/**
 * Returns array of newly added CoinPairs to CoinChange exchange for specified currency sorted by 24h volume
 * @param fetchedCoinsData - Data from CoinsDataService
 * @param currency - Target currency (USD/EUR)
 * @returns Array of CoinPair sorted by volume descending
 */
export const getNewCoins = (fetchedCoinsData: CoinsMap, currency: string): CoinPair[] => {
  const currencyData = fetchedCoinsData.get(currency);
  if (!currencyData) return [];

  return Array.from(currencyData.entries())
    .map(([_, { coinPair }]) => coinPair)
    .filter((coinPair) => coinPair.new)
    .sort((a, b) => {
      const volumeA = Number(a.approximate_quote_24h_volume || 0);
      const volumeB = Number(b.approximate_quote_24h_volume || 0);
      return volumeB - volumeA;
    });
};
