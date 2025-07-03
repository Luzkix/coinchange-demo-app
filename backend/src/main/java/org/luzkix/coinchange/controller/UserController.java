package org.luzkix.coinchange.controller;

import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.backendapi.api.ApiUserApi;
import org.luzkix.coinchange.openapi.backendapi.model.*;
import org.luzkix.coinchange.service.UserService;
import org.luzkix.coinchange.utils.validations.BusinessValidations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController extends GenericController implements ApiUserApi {

    @Autowired
    private UserService userService;

    @Override
    public ResponseEntity<UserLoginResponseDto> createUser(UserRegistrationRequestDto registrationDto) {
        validateUserRegistrationRequestDto(registrationDto);

        UserLoginResponseDto newUser = userService.createUser(registrationDto);

        return ResponseEntity.status(201).body(newUser);
    }

    @Override
    public ResponseEntity<UserLoginResponseDto> loginUser(UserLoginRequestDto userLoginDto) {
        validateUserLoginRequestDto(userLoginDto);

        UserLoginResponseDto loggedUser = userService.logUser(userLoginDto);

        return ResponseEntity.status(201).body(loggedUser);
    }

    @Override
    public ResponseEntity<RefreshTokenResponseDto> refreshToken() {
        User user = getUserFromAuthentication();

        RefreshTokenResponseDto refreshTokenDto = userService.refreshToken(user);

        return ResponseEntity.status(201).body(refreshTokenDto);
    }

    @Override
    public ResponseEntity<UserLoginResponseDto> updateUser(UserUpdateRequestDto userUpdateRequestDto) {
        User user = getUserFromAuthentication();

        UserLoginResponseDto updatedUser = userService.updateUser(userUpdateRequestDto, user);

        return ResponseEntity.status(201).body(updatedUser);
    }

    private void validateUserRegistrationRequestDto(UserRegistrationRequestDto registrationDto) {
        BusinessValidations.isValidUsername(registrationDto.getUsername(),null);
        BusinessValidations.isValidEmail(registrationDto.getEmail(),null);
        BusinessValidations.isValidPassword(registrationDto.getPassword(),null);
    }

    private void validateUserLoginRequestDto(UserLoginRequestDto userLoginDto) {
        BusinessValidations.isFieldNotNullOrEmpty(userLoginDto.getUsernameOrEmail(), "Input for username/email is empty!");
        BusinessValidations.isFieldNotNullOrEmpty(userLoginDto.getPassword(), "Password is empty!");
    }
}