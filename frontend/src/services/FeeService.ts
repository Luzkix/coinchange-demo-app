import { ApiFeeService, type TotalFeesResponseDto } from '../api-generated/backend';

export const FeeService = {
  /**
   * Fetches total fees collected from all users from backend API.
   */
  async fetchTotalFees(targetCurrencyCode: string): Promise<TotalFeesResponseDto> {
    console.log('Fetching total fees collected from all users...');
    return ApiFeeService.getTotalFees(targetCurrencyCode);
  },

  /**
   * Fetches total fees collected from current user from backend API.
   */
  async fetchTotalFeesForUser(targetCurrencyCode: string): Promise<TotalFeesResponseDto> {
    console.log('Fetching total fees collected from current user...');
    return ApiFeeService.getTotalFeesForUser(targetCurrencyCode);
  },
};
