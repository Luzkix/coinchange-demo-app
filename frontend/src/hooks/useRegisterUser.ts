import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../api-generated/backend';
import { UserService } from '../services/UserService.ts';
import { useProcessApiError } from './useProcessApiError.ts';

export const useRegisterUser = () => {
  const { login } = useAuth();
  const processApiError = useProcessApiError();
  const processName = useRegisterUser.name;

  return useMutation({
    mutationFn: UserService.register,
    onSuccess: (data) => {
      login({
        id: data.id,
        username: data.username,
        email: data.email,
        userCreatedAt: new Date(data.createdAt),
        userUpdatedAt: new Date(data.updatedAt),
        userValidTo: new Date(data.validTo),
        roles: data.roles?.map((role) => role.roleName) ?? [],
        feeCategory: data.feeCategory.feeCategory,
        feeRate: data.feeCategory.feeRate,
        accessToken: data.jwtToken,
      });
    },
    onError: (apiError: ApiError) => {
      processApiError(apiError, processName);
    },
  });
};
