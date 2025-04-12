package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.Role;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.uiapi.model.UserRegistrationRequestDto;

import java.util.Set;

public interface UserDao {
    User createUser(UserRegistrationRequestDto registrationDto, Set<Role> roles);

    User findActiveUserByUsernameOrEmail(String username, String email);

    User findById(Long userId);
}