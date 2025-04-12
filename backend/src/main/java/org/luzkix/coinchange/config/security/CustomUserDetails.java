package org.luzkix.coinchange.config.security;

import org.luzkix.coinchange.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {
  private User user;
  private String username;
  private String password;
  private Set<GrantedAuthority> grantedAuthorities = new HashSet<>();

  public static CustomUserDetails provideCustomUserDetails(User user) {
    CustomUserDetails details = new CustomUserDetails();
    details.user = user;
    details.username = user.getUsername();
    details.password = user.getPassword();
    details.grantedAuthorities = details.getAuthorities();
    return details;
  }

  @Override
  public Set<GrantedAuthority> getAuthorities() {
    return user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .collect(Collectors.toSet());
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  @Override
  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  @Override
  public String getPassword() {
    return password;
  }
  public void setPassword(String password) {
    this.password = password;
  }
}
