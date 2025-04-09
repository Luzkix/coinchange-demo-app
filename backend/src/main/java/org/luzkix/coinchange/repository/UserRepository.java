package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE LOWER(TRIM(BOTH FROM u.username)) = LOWER(TRIM(BOTH FROM :username)) " +
            "OR LOWER(TRIM(BOTH FROM u.email)) = LOWER(TRIM(BOTH FROM :email))")
    Optional<User> findByUsernameOrEmailIgnoreCaseTrimmed(String username, String email);
}
