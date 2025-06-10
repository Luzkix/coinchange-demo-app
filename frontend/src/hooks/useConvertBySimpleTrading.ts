import { useMutation } from '@tanstack/react-query';
import { ApiError, BalancesResponseDto } from '../api-generated/backend';
import { useProcessApiError } from './useProcessApiError.ts';
import { CurrencyService } from '../services/CurrencyService.ts';

export const useConvertBySimpleTrading = () => {
  const processApiError = useProcessApiError();
  const processName = useConvertBySimpleTrading.name;

  return useMutation({
    mutationFn: CurrencyService.convertBySimpleTrading,
    onSuccess: (data: BalancesResponseDto) => {
      return data;
    },
    onError: (apiError: ApiError) => {
      processApiError(apiError, processName);
    },
  });
};
