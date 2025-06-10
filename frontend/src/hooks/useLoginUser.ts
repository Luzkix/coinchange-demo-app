import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { ApiError, OpenAPI } from '../api-generated/backend';
import { UserService } from '../services/UserService.ts';
import { useProcessApiError } from './useProcessApiError.ts';

export const useLoginUser = () => {
  const { login } = useAuth();
  const processApiError = useProcessApiError();
  const processName = useLoginUser.name;

  OpenAPI.TOKEN = undefined; //to be sure that old token is never handed over to login endpoint even by mistake

  return useMutation({
    mutationFn: UserService.login,
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
