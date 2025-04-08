package org.luzkix.coinchange.controller;

import org.luzkix.coinchange.openapi.uiapi.api.LoginApi;
import org.luzkix.coinchange.openapi.uiapi.model.LoginResponseDto;
import org.luzkix.coinchange.openapi.uiapi.model.UserRegistrationRequestDto;
import org.luzkix.coinchange.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController extends UIAPIController implements LoginApi {

    @Autowired
    private UserService userService;

    @Override
    public ResponseEntity<LoginResponseDto> createUser(UserRegistrationRequestDto userDto) {
        LoginResponseDto newUser = userService.createUser(userDto);
        return ResponseEntity.status(201).body(newUser);
    }
}
