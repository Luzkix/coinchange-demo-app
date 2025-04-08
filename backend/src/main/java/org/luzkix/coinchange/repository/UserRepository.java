package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findFirstByUsernameOrEmail(String username, String email);
}
