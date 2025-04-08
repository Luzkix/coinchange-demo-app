package org.luzkix.coinchange.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deaktivace CSRF ochrany (pokud používám JWT token, nepotřebuji ji, jinak zapnout)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // Povolení všech požadavků
        return http.build();
    }
}
