import {
  ApiUserService,
  RefreshTokenResponseDto,
  UserLoginRequestDto,
  UserLoginResponseDto,
  UserRegistrationRequestDto,
  UserUpdateRequestDto,
} from '../api-generated/backend';
import { RefreshTokenError } from '../constants/customErrors.ts';

/**
 * UserService provides api calls related to user administration.
 */
export const UserService = {
  /**
   * Registers a new user using the backend API.
   * Returns UserLoginResponseDto on success.
   */
  async register(data: UserRegistrationRequestDto): Promise<UserLoginResponseDto> {
    console.log('Registering user...');
    return ApiUserService.createUser(data);
  },
  /**
   * Logs-in a user using the backend API.
   * Returns UserLoginResponseDto on success.
   */
  async login(data: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    console.log(`Logging-in the user with username/email: ${data.usernameOrEmail} ...`);
    return ApiUserService.loginUser(data);
  },
  /**
   * Getting fresh token with updated validity using the backend API.
   * Returns RefreshTokenResponseDto on success.
   */
  async refreshToken(): Promise<RefreshTokenResponseDto> {
    try {
      console.log('Refreshing user token...');
      return await ApiUserService.refreshToken();
    } catch (error) {
      const message = `Failed to refresh user token`;
      console.log(message);

      throw new RefreshTokenError(
        message,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },
  /**
   * Updates a user using the backend API.
   * Returns UserLoginResponseDto on success.
   */
  async update(data: UserUpdateRequestDto): Promise<UserLoginResponseDto> {
    console.log('Updating user data...');
    return ApiUserService.updateUser(data);
  },
};
