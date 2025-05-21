package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.User;

public interface UserDao {
    User save(User user);

    User findActiveUserByUsernameOrEmail(String username, String email);

    User findById(Long userId);
}