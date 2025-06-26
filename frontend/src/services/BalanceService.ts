import { ApiBalanceService, BalancesResponseDto } from '../api-generated/backend';
import { BalanceTypeEnum } from '../constants/customEnums.ts';
import { FetchBalancesError } from '../constants/customErrors.ts';

export const BalanceService = {
  /**
   * Fetches user balances (fiat & crypto) from backend API.
   */
  async fetchBalances(balanceType: BalanceTypeEnum): Promise<BalancesResponseDto> {
    try {
      console.log('Fetching user balances...');
      return await ApiBalanceService.getBalances(balanceType);
    } catch (error) {
      const message = `Failed to fetch user balances for balance type ${balanceType}`;
      console.log(message);

      throw new FetchBalancesError(
        message,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },

  /**
   * Fetches balances (fiat & crypto) of all users from backend API.
   */
  async fetchBalancesOfAllUsers(balanceType: BalanceTypeEnum): Promise<BalancesResponseDto[]> {
    try {
      console.log('Fetching balances of all users...');
      return await ApiBalanceService.getBalancesForAllUsers(balanceType);
    } catch (error) {
      const message = `Failed to fetch balances of all users for balance type ${balanceType}`;
      console.log(message);

      throw new FetchBalancesError(
        message,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },
};
