import { useMutation } from '@tanstack/react-query';
import { ApiError } from '../api-generated/backend';
import { UserService } from '../services/UserService.ts';
import { useProcessApiError } from './useProcessApiError.ts';

export const useSuspendUser = () => {
  const processApiError = useProcessApiError();
  const processName = useSuspendUser.name;

  return useMutation({
    mutationFn: UserService.suspendUser,
    onError: (apiError: ApiError) => {
      processApiError(apiError, processName);
    },
  });
};
