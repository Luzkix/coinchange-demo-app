import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../api-generated/backend';
import { UserService } from '../services/UserService.ts';
import { useProcessApiError } from './useProcessApiError.ts';

export const useRegisterUser = () => {
  const { login } = useAuth();
  const processApiError = useProcessApiError();

  return useMutation({
    mutationFn: UserService.register,
    onSuccess: (data) => {
      login(data.jwtToken, {
        id: data.id,
        email: data.email,
        roles: data.roles?.map((r) => r.roleName) ?? [],
      });
    },
    onError: (apiError: ApiError) => {
      processApiError(apiError, 'useRegisterUser');
    },
  });
};
