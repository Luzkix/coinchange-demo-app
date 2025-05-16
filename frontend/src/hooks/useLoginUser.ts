import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../api-generated/backend';
import { UserService } from '../services/UserService.ts';
import { useProcessApiError } from './useProcessApiError.ts';

export const useLoginUser = () => {
  const { login } = useAuth();
  const processApiError = useProcessApiError();
  const processName = useLoginUser.name;

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
        accessToken: data.jwtToken,
      });
    },
    onError: (apiError: ApiError) => {
      processApiError(apiError, processName);
    },
  });
};
