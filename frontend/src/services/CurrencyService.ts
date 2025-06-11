import {
  type AdvancedTradingConversionRequestDto,
  ApiCurrencyService,
  type BalancesResponseDto,
  type CurrencyConversionRateResponseDto,
  CurrencyResponseDto,
  type SimpleTradingConversionRequestDto,
} from '../api-generated/backend';
import {
  AdvancedTradingError,
  FetchMarketConversionRateError,
  FetchSupportedCurrenciesError,
} from '../constants/customErrors.ts';

/**
 * Service for fetching and processing currencies and currencies conversions from Backend API
 */
export const CurrencyService = {
  /**
   * Fetches both fiat/crypto currencies which are allowed to be used for trading
   */
  async fetchSupportedCurrencies(): Promise<CurrencyResponseDto[]> {
    try {
      console.log('Fetching supported currencies from backend...');
      return await ApiCurrencyService.getSupportedCurrencies();
    } catch (error) {
      const message = `Failed to fetch supported currencies`;
      console.log(message);

      throw new FetchSupportedCurrenciesError(
        message,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },

  /**
   * Fetches backend validated market conversion rate for a pair of sold/bought currencies
   */
  async fetchMarketConversionRate(
    soldCurrencyCode: string,
    boughtCurrencyCode: string,
  ): Promise<CurrencyConversionRateResponseDto> {
    try {
      console.log('Fetching market conversion rate from backend...');
      return await ApiCurrencyService.getMarketConversionRate(soldCurrencyCode, boughtCurrencyCode);
    } catch (error) {
      const message = `Failed to fetch market conversion rate for ${soldCurrencyCode}-${boughtCurrencyCode}`;
      console.log(message);

      throw new FetchMarketConversionRateError(
        message,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },

  /**
   * converts currencies using simple trading with backend API.
   * Returns BalancesResponseDto on success.
   */
  async convertBySimpleTrading(
    data: SimpleTradingConversionRequestDto,
  ): Promise<BalancesResponseDto> {
    console.log(`Converting currencies using simple trading...`);
    return await ApiCurrencyService.convertCurrenciesUsingSimppleTrading(data);

    // try {
    //   console.log(`Converting currencies using simple trading...`);
    //   return await ApiCurrencyService.convertCurrenciesUsingSimppleTrading(data);
    // } catch (error) {
    //   const message = `Failed to convert currencies using simple trading`;
    //   console.log(message);
    //
    //   throw new SimpleTradingError(
    //     message,
    //     error instanceof Error ? error : new Error(String(error)),
    //   );
    // }
  },

  /**
   * converts currencies using advanced trading with backend API.
   * Returns BalancesResponseDto on success.
   */
  async convertByAdvancedTrading(
    data: AdvancedTradingConversionRequestDto,
  ): Promise<BalancesResponseDto> {
    try {
      console.log(`Converting currencies using advanced trading...`);
      return await ApiCurrencyService.convertCurrenciesUsingAdvancedTrading(data);
    } catch (error) {
      const message = `Failed to convert currencies using advanced trading`;
      console.log(message);

      throw new AdvancedTradingError(
        message,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },
};
