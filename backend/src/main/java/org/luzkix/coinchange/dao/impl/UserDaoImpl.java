package org.luzkix.coinchange.dao.impl;

import lombok.RequiredArgsConstructor;
import org.luzkix.coinchange.dao.UserDao;
import org.luzkix.coinchange.model.Role;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.repository.UserRepository;
import org.luzkix.coinchange.utils.UserUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class UserDaoImpl implements UserDao {

    private final UserRepository userRepository;

    @Override
    public User findUserByUsernameOrEmail(String username, String email) {
        return userRepository.findByUsernameOrEmailIgnoreCaseTrimmed(username, email)
                .orElse(null);
    }
    @Override
    public User findActiveUserByUsernameOrEmail(String username, String email) {
        return userRepository.findByUsernameOrEmailIgnoreCaseTrimmed(username, email)
                .filter(UserUtils::isActiveUser)
                .orElse(null);
    }

    @Override
    public List<User> findAllActiveUsers() {
        return userRepository.findAll().stream()
                .filter(UserUtils::isActiveUser)
                //do not return admin users
                .filter(user -> user.getRoles().stream()
                        .noneMatch(role -> role.getName().equals(Role.RoleEnum.ADMIN.getName()))
                )
                .toList();
    }

    @Override
    public User findActiveUserByUsername(String username) {
        return userRepository.findByUsernameIgnoreCaseTrimmed(username)
                .filter(UserUtils::isActiveUser)
                .orElse(null);
    }

    @Override
    public User findActiveUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCaseTrimmed(email)
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
    }
}
