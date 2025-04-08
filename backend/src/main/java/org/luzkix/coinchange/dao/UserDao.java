package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.uiapi.model.UserRegistrationRequestDto;

public interface UserDao {
    User createUser(UserRegistrationRequestDto registrationDto);

    boolean existsByUsernameOrEmailWithActiveAccount(String username, String email);
}