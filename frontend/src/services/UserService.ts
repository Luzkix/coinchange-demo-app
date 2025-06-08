import {
  ApiUserService,
  RefreshTokenResponseDto,
  UserLoginRequestDto,
  UserLoginResponseDto,
  UserRegistrationRequestDto,
  UserUpdateRequestDto,
} from '../api-generated/backend';
import {
  LoginUserError,
  RefreshTokenError,
  RegisterUserError,
  UpdateUserError,
} from '../constants/customErrors.ts';

/**
 * UserService provides api calls related to user administration.
 */
export const UserService = {
  /**
   * Registers a new user using the backend API.
   * Returns UserLoginResponseDto on success.
   */
  async register(data: UserRegistrationRequestDto): Promise<UserLoginResponseDto> {
    try {
      console.log('Registering user...');
      return await ApiUserService.createUser(data);
    } catch (error) {
      const message = `Failed to register new user with username: ${data.username}`;
      console.log(message);

      throw new RegisterUserError(
        message,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  },
  /**
   * Logs-in a user using the backend API.
   * Returns UserLoginResponseDto on success.
   */
  async login(data: UserLoginRequestDto): Promise<UserLoginResponseDto> {
    try {
      console.log(`Logging-in the user with username/email: ${data.usernameOrEmail} ...`);
      return await ApiUserService.loginUser(data);
    } catch (error) {
      const message = `Failed to log-in the user with username/email: ${data.usernameOrEmail}`;
      console.log(message);

      throw new LoginUserError(message, error instanceof Error ? error : new Error(String(error)));
    }
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
    try {
      console.log('Updating user data...');
      return await ApiUserService.updateUser(data);
    } catch (error) {
      const message = `Failed to update user data`;
      console.log(message);

      throw new UpdateUserError(message, error instanceof Error ? error : new Error(String(error)));
    }
  },
};
