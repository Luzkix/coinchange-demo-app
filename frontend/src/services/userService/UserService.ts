// src/services/userService/UserService.ts
import {
  ApiUserService,
  UserLoginResponseDto,
  UserRegistrationRequestDto,
} from '../../api-generated/backend';

/**
 * Registers a new user using the backend API.
 * Returns UserLoginResponseDto on success.
 */
export const registerUser = async (
  data: UserRegistrationRequestDto,
): Promise<UserLoginResponseDto> => {
  return await ApiUserService.createUser(data);
};
