import { ApiBalanceService, BalancesResponseDto } from '../api-generated/backend';
import { BalanceTypeEnum } from '../constants/customEnums.ts';

/**
 * Fetches user balances (fiat & crypto) from API.
 */
export const BalanceService = {
  fetchBalances: async (balanceType: BalanceTypeEnum) => {
    return ApiBalanceService.getBalances(balanceType) as Promise<BalancesResponseDto>;
  },
};
