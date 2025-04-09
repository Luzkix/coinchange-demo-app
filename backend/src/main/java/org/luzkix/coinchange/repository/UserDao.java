package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.uiapi.model.UserRegistrationRequestDto;

public interface UserDao {
    User createUser(UserRegistrationRequestDto registrationDto);

    User findActiveUserByUsernameOrEmail(String username, String email);
}