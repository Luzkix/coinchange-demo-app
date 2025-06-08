import { ApiBalanceService, BalancesResponseDto } from '../api-generated/backend';
import { BalanceTypeEnum } from '../constants/customEnums.ts';
import { FetchBalancesError } from '../constants/customErrors.ts';

export const BalanceService = {
  /**
   * Fetches user balances (fiat & crypto) from API.
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
};
