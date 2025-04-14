package org.luzkix.coinchange.config.security;

import org.luzkix.coinchange.config.security.jwt.JwtFilter;
import org.luzkix.coinchange.controller.UIAPIController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private HandlerExceptionResolver handlerExceptionResolver;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF protection
                .authorizeHttpRequests(auth -> auth
                        // Allow access to Swagger UI and API docs without authentication for testing purposes
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                        // Allow public access to login and register endpoints
                        .requestMatchers(UIAPIController.BASE_UI_URI + "/user/login", UIAPIController.BASE_UI_URI + "/user/register").permitAll()

                        // Restrict access to /admin/** only for ADMIN role
                        .requestMatchers(UIAPIController.BASE_UI_URI + "/admin/**").hasRole("ADMIN")

                        // Allow ADMIN and USER roles to access all other endpoints
                        .requestMatchers(UIAPIController.BASE_UI_URI + "/**").hasAnyRole("ADMIN", "USER")

                        // Require authentication for any other requests
                        .anyRequest().authenticated()
                )
                // Custom handling of exceptions which are being processed within security layer before the request reaches its endpoint
                // The exceptions will be resolved within common handlerExceptionResolver == processed by my own ExceptionHandlerAdvice (which ensures creation of proper ErrorDTO).
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            handlerExceptionResolver.resolveException(request, response, null, accessDeniedException);
                        })
                        .authenticationEntryPoint((request, response, authException) -> {
                            handlerExceptionResolver.resolveException(request, response, null, authException);
                        })
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
