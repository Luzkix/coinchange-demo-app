package org.luzkix.coinchange.dao.impl;

import org.luzkix.coinchange.dao.UserDao;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.repository.UserRepository;
import org.luzkix.coinchange.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserDaoImpl implements UserDao {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findActiveUserByUsernameOrEmail(String username, String email) {
        return userRepository.findByUsernameOrEmailIgnoreCaseTrimmed(username, email)
                .filter(UserUtils::isActiveUser)
                .orElse(null);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public User findById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    };
}
