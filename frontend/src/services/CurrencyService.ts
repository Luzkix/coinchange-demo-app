import {
  type AdvancedTradingConversionRequestDto,
  ApiCurrencyService,
  type BalancesResponseDto,
  type CurrencyConversionRateResponseDto,
  CurrencyResponseDto,
  type SimpleTradingConversionRequestDto,
} from '../api-generated/backend';
import { FetchSupportedCurrenciesError } from '../constants/customErrors.ts';

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
    console.log('Fetching market conversion rate from backend...');
    return await ApiCurrencyService.getMarketConversionRate(soldCurrencyCode, boughtCurrencyCode);
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
  },

  /**
   * converts currencies using advanced trading with backend API.
   * Returns BalancesResponseDto on success.
   */
  async convertByAdvancedTrading(
    data: AdvancedTradingConversionRequestDto,
  ): Promise<BalancesResponseDto> {
    console.log(`Converting currencies using advanced trading...`);
    return await ApiCurrencyService.convertCurrenciesUsingAdvancedTrading(data);
  },
};
