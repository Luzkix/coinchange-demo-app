import { ApiUserService, UserRegistrationRequestDto } from '../api-generated/backend';

/**
 * Registers a new user using the backend API.
 * Returns UserLoginResponseDto on success.
 */
export const UserService = {
  register: async (data: UserRegistrationRequestDto) => {
    return ApiUserService.createUser(data);
  },
};
