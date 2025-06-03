import {
  ApiUserService,
  UserLoginRequestDto,
  UserRegistrationRequestDto,
  UserUpdateRequestDto,
} from '../api-generated/backend';

/**
 * UserService provides api calls related to user administration.
 */
export const UserService = {
  /**
   * Registers a new user using the backend API.
   * Returns UserLoginResponseDto on success.
   */
  register: async (data: UserRegistrationRequestDto) => {
    return ApiUserService.createUser(data);
  },
  /**
   * Logs-in a user using the backend API.
   * Returns UserLoginResponseDto on success.
   */
  login: async (data: UserLoginRequestDto) => {
    return ApiUserService.loginUser(data);
  },
  /**
   * Getting fresh token with updated validity using the backend API.
   * Returns RefreshTokenResponseDto on success.
   */
  refreshToken: async () => {
    return ApiUserService.refreshToken();
  },
  /**
   * Updates a user using the backend API.
   * Returns UserLoginResponseDto on success.
   */
  update: async (data: UserUpdateRequestDto) => {
    return ApiUserService.updateUser(data);
  },
};
