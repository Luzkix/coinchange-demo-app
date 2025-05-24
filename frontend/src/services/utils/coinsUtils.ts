import { CoinsDefaultColorEnum, CurrencyTypeEnum } from '../../constants/customEnums.ts';
import { CoinPair } from '../../api-generated/coinbase';
import { CoinsMap } from '../../constants/customTypes.ts';
import { QueryClient } from '@tanstack/react-query';
import { createFetchCoinPairStatsOptions } from '../../constants/customQueryOptions.ts';
import { FetchCoinStatsError } from '../../constants/customErrors.ts';
import { TFunction } from 'i18next';
import { CoinsTableRowData } from '../../components/common/CoinsTable/CoinsTable.tsx';
import { CurrencyResponseDto } from '../../api-generated/backend';

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
 * Calculates percentage change between 2 string numbers. Can be used e.g. for calculation of 24h price change percentage.
 * @param initialPrice - initial price, e.g. "100"
 * @param currentPrice - most recent price, e.g. "120"
 * @returns string number rounded to 2 decimal points representing % change between currentPrice and initialPrice, e.g. "20.00"
 */
export const getPriceChangePercentageFromStringNumbers = (
  initialPrice: string,
  currentPrice: string,
): string => {
  const pricePercentageChange = (parseFloat(currentPrice) / parseFloat(initialPrice) - 1) * 100;
  return pricePercentageChange.toFixed(2);
};

/**
 * Returns array of tradeable CoinPairs for specified currency sorted by 24h volume
 * @param fetchedCoinsData - Data from CoinsDataService
 * @param currency - Target currency (USD/EUR)
 * @returns Array of CoinPair sorted by volume descending
 */
export const getTradeableCoins = (fetchedCoinsData: CoinsMap, currency: string): CoinPair[] => {
  const currencyData = fetchedCoinsData.get(currency);
  if (!currencyData) return [];

  return Array.from(currencyData.entries())
    .filter(([_, { isTradeable }]) => isTradeable)
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

/**
 * Function accepts [CoinPair] - for each CoinPair properties such as 'price' and 'price_percentage_change_24h' are being updated with fresh values
 * @param displayedCoins - coins to be displayed within e.g. CoinCard
 * @param queryClient - queryClient handed over from main component to be used for handling fetching calls
 * @param t - translation hook handed over from main component to be used for creating error message
 * @param addErrorPopup - error function handed over from main component to be used for creating error message
 * @returns Array of CoinPair as a Promise with refreshed properties such as 'price' and 'price_percentage_change_24h'
 */
export const updateCoinsPrices = async (
  displayedCoins: CoinPair[],
  queryClient: QueryClient,
  addErrorPopup?: (message: string) => void,
  t?: TFunction<string[], undefined>,
): Promise<CoinPair[]> => {
  return Promise.all(
    displayedCoins.map(async (coin) => {
      try {
        const coinStats = await queryClient.fetchQuery(
          createFetchCoinPairStatsOptions(coin.product_id),
        );

        return {
          ...coin,
          price: coinStats.last,
          price_percentage_change_24h: getPriceChangePercentageFromStringNumbers(
            coinStats.open,
            coinStats.last,
          ),
        };
      } catch (error) {
        console.error('Error updating prices:', error);

        if (error instanceof FetchCoinStatsError && addErrorPopup && t) {
          addErrorPopup(t('errors:message.fetchCoinStatsError') + coin.product_id);
        }
        return coin;
      }
    }),
  );
};

/**
 * Function accepts [CoinPair] - for each CoinPair properties such as 'price' and 'price_percentage_change_24h' are being updated with fresh values
 * @param coinsData - original coinsData to be converted
 * @param selectedCurrency - currency to be used to filter coins matching this currency
 * @returns Array of CoinPair as a Promise with refreshed properties such as 'price' and 'price_percentage_change_24h'
 */
export const convertCoinsDataIntoCoinsTableRowData = (
  coinsData: CoinsMap,
  selectedCurrency: string,
): CoinsTableRowData[] => {
  // @ts-ignore
  return Array.from(coinsData.get(selectedCurrency).values()).map(({ coinPair, isTradeable }) => ({
    id: coinPair.product_id,
    coinSymbol: coinPair.base_currency_id,
    coinName: coinPair.base_name,
    price: parseFloat(coinPair.price || '0'),
    priceChange24: parseFloat(coinPair.price_percentage_change_24h || '0'),
    volume24: parseFloat(coinPair.approximate_quote_24h_volume || '0'),
    isNew: Boolean(coinPair.new), // ensuring that the value will always be boolean
    isTradeable: isTradeable,
    fiatCurrency: selectedCurrency,
    fullCoinPairData: coinPair,
  }));
};

/**
 * Function filters and returns only FIAT currencies out of all currencies.
 */
export const getFiatCurrencies = (data: CurrencyResponseDto[]) => {
  return data.filter((cur) => cur.type === CurrencyTypeEnum.FIAT.valueOf()).map((cur) => cur.code);
};

/**
 * Function filters and returns only CRYPTO currencies out of all currencies.
 */
export const getCryptoCurrencies = (data: CurrencyResponseDto[]) => {
  return data
    .filter((cur) => cur.type === CurrencyTypeEnum.CRYPTO.valueOf())
    .map((cur) => cur.code);
};
