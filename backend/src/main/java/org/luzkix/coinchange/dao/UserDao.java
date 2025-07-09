package org.luzkix.coinchange.dao;

import org.luzkix.coinchange.model.User;

import java.util.List;

public interface UserDao {
    User save(User user);

    User findUserByUsernameOrEmail(String username, String email);

    User findActiveUserByUsernameOrEmail(String username, String email);

    User findActiveUserByUsername(String username);

    List<User> findAllActiveUsers();

    User findActiveUserByEmail(String email);

    User findById(Long userId);
}