package org.luzkix.coinchange.config.security;

import jakarta.transaction.Transactional;
import org.luzkix.coinchange.exceptions.InvalidJwtTokenException;
import org.luzkix.coinchange.model.User;
import org.luzkix.coinchange.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import static org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum.USER_NOT_FOUND;

@Component
public class CustomUserDetailsService implements UserDetailsService {

  @Autowired
  UserService userService;

  @Override
  @Transactional
  public CustomUserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
    Long userId = Long.valueOf(id);
    User user = userService.findUserById(userId);
    if (user == null) throw new InvalidJwtTokenException("User not found with ID: " + id, USER_NOT_FOUND);

    return CustomUserDetails.provideCustomUserDetails(user);
  }
}
