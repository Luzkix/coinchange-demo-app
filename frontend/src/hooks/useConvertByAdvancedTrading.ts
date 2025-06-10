import { useMutation } from '@tanstack/react-query';
import { ApiError, BalancesResponseDto } from '../api-generated/backend';
import { useProcessApiError } from './useProcessApiError.ts';
import { CurrencyService } from '../services/CurrencyService.ts';

export const useConvertByAdvancedTrading = () => {
  const processApiError = useProcessApiError();
  const processName = useConvertByAdvancedTrading.name;

  return useMutation({
    mutationFn: CurrencyService.convertByAdvancedTrading,
    onSuccess: (data: BalancesResponseDto) => {
      return data;
    },
    onError: (apiError: ApiError) => {
      processApiError(apiError, processName);
    },
  });
};
