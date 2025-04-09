package org.luzkix.coinchange.repository.impl;

import jakarta.transaction.Transactional;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.uiapi.model.UserRegistrationRequestDto;
import org.luzkix.coinchange.repository.UserDao;
import org.luzkix.coinchange.repository.UserRepository;
import org.luzkix.coinchange.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

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
    @Transactional
    public User createUser (UserRegistrationRequestDto registrationDto) {
        User user = new User();

        user.setUsername(registrationDto.getUsername());
        user.setEmail(registrationDto.getEmail());
        user.setPassword(registrationDto.getPassword());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setValidTo(LocalDateTime.of(2100, 1, 1, 0, 0));

        return userRepository.save(user);
    }
}
