import { useMutation } from '@tanstack/react-query';
import { UserService } from '../services/UserService.ts';
import { useProcessApiError } from './useProcessApiError.ts';
import { ApiError } from '../api-generated/backend';

export const useRefreshToken = () => {
  const processApiError = useProcessApiError();

  return useMutation({
    mutationFn: UserService.refreshToken,
    onError: (error: ApiError) => {
      processApiError(error, 'useRefreshToken');
    },
  });
};
