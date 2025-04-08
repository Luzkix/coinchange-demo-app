package org.luzkix.coinchange.service;

import org.luzkix.coinchange.openapi.uiapi.model.LoginResponseDto;
import org.luzkix.coinchange.openapi.uiapi.model.UserRegistrationRequestDto;

public interface UserService {
    LoginResponseDto createUser(UserRegistrationRequestDto registrationDto);
}
