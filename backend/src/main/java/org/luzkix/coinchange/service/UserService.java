package org.luzkix.coinchange.service;

import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.model.*;

import java.util.List;

public interface UserService {
    UserLoginResponseDto createUser(UserRegistrationRequestDto registrationDto);

    UserLoginResponseDto logUser(UserLoginRequestDto userLoginDto);

    User findUserById(Long userId);

    List<User> findAllActiveUsers();

    RefreshTokenResponseDto refreshToken(User user);

    UserLoginResponseDto updateUser(UserUpdateRequestDto userLoginDto, User user);
}
