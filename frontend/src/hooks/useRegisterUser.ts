import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useGeneralContext } from '../contexts/GeneralContext';
import { ApiError, ErrorDto } from '../api-generated/backend';
import { UserService } from '../services/UserService.ts';

export const useRegisterUser = () => {
  const { login } = useAuth();
  const { addErrorModal, addErrorPopup } = useGeneralContext();

  return useMutation({
    mutationFn: UserService.register,
    onSuccess: (data) => {
      login(data.jwtToken, {
        id: data.id,
        email: data.email,
        roles: data.roles?.map((r) => r.roleName) ?? [],
      });
    },
    onError: (error: ApiError) => {
      const errorDto: ErrorDto = error?.body;

      if (errorDto?.errorBusinessCode) {
        addErrorModal(errorDto.errorMessage ?? '', errorDto.errorStatus ?? '');
      } else {
        addErrorPopup(errorDto?.errorMessage || 'Unexpected error during user registration.');
      }
    },
  });
};
