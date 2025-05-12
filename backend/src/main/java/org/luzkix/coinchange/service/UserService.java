package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.model.RefreshTokenResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.UserLoginRequestDto;
import org.luzkix.coinchange.openapi.backendapi.model.UserLoginResponseDto;
import org.luzkix.coinchange.openapi.backendapi.model.UserRegistrationRequestDto;

public interface UserService {
    UserLoginResponseDto createUser(UserRegistrationRequestDto registrationDto);

    UserLoginResponseDto logUser(UserLoginRequestDto userLoginDto);

    User findUserById(Long userId);

    RefreshTokenResponseDto refreshToken(User user);
}
