package org.luzkix.coinchange.dao.impl;

import jakarta.transaction.Transactional;
import org.luzkix.coinchange.dao.UserDao;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.openapi.uiapi.model.UserRegistrationRequestDto;
import org.luzkix.coinchange.repository.UserRepository;
import org.luzkix.coinchange.utils.DatesUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserDaoImpl implements UserDao {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean existsByUsernameOrEmailWithActiveAccount(String username, String email) {
        return userRepository.findFirstByUsernameOrEmail(username, email)
                .filter(user -> DatesUtils.isFutureDateGreater(LocalDateTime.now(), user.getValidTo()))
                .isPresent();
    }

    @Override
    @Transactional // Ensures atomicity of the operation
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
