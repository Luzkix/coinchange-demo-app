package org.luzkix.coinchange.config.security;

import org.luzkix.coinchange.config.security.jwt.JwtFilter;
import org.luzkix.coinchange.controller.UIAPIController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll() // Allow access to Swagger UI and API docs without authentication
                        .requestMatchers(UIAPIController.BASE_UI_URI+"/user/login", UIAPIController.BASE_UI_URI+"/user/register").permitAll() // Allow public access to login and register endpoints
                        .requestMatchers(UIAPIController.BASE_UI_URI+"/admin/**").hasRole("ADMIN") // Admin-only endpoints
                        //.requestMatchers(UIAPIController.BASE_UI_URI+"/user/**").hasAnyRole("ADMIN", "USER") // User and Admin endpoints
                        .anyRequest().authenticated() // Require authentication for all other endpoints
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter

        return http.build();
    }
}
