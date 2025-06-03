package org.luzkix.coinchange.repository;

import org.luzkix.coinchange.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by username or email, ignoring case and trimming whitespace.
     */
    @Query("SELECT u FROM User u WHERE LOWER(TRIM(BOTH FROM u.username)) = LOWER(TRIM(BOTH FROM :username)) " +
            "OR LOWER(TRIM(BOTH FROM u.email)) = LOWER(TRIM(BOTH FROM :email))")
    Optional<User> findByUsernameOrEmailIgnoreCaseTrimmed(@Param("username") String username, @Param("email") String email);

    /**
     * Finds a user by username, ignoring case and trimming whitespace.
     */
    @Query("SELECT u FROM User u WHERE LOWER(TRIM(BOTH FROM u.username)) = LOWER(TRIM(BOTH FROM :username))")
    Optional<User> findByUsernameIgnoreCaseTrimmed(@Param("username") String username);

    /**
     * Finds a user by email, ignoring case and trimming whitespace.
     */
    @Query("SELECT u FROM User u WHERE LOWER(TRIM(BOTH FROM u.email)) = LOWER(TRIM(BOTH FROM :email))")
    Optional<User> findByEmailIgnoreCaseTrimmed(@Param("email") String email);
}
