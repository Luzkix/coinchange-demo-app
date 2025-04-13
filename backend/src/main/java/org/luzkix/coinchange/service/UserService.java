package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.uiapi.model.RefreshTokenResponseDto;
import org.luzkix.coinchange.openapi.uiapi.model.UserLoginRequestDto;
import org.luzkix.coinchange.openapi.uiapi.model.UserLoginResponseDto;
import org.luzkix.coinchange.openapi.uiapi.model.UserRegistrationRequestDto;

public interface UserService {
    UserLoginResponseDto createUser(UserRegistrationRequestDto registrationDto);

    UserLoginResponseDto logUser(UserLoginRequestDto userLoginDto);

    User findUserById(Long userId);

    RefreshTokenResponseDto refreshToken(User user);
}
