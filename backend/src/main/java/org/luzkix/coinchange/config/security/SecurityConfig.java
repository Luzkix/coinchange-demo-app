package org.luzkix.coinchange.config.security;

import org.luzkix.coinchange.config.security.jwt.JwtFilter;
import org.luzkix.coinchange.exceptions.CustomSecurityExceptionHandlerFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

    @Autowired
    private CustomSecurityExceptionHandlerFilter customSecurityExceptionHandlerFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF protection
                .authorizeHttpRequests(auth -> auth
                        // Allow access to Swagger UI and API docs without authentication for testing purposes
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                        // Allow public access to GET/currency and login + register endpoints
                        .requestMatchers(HttpMethod.GET, "/currency").permitAll()
                        .requestMatchers("/user/login", "/user/register").permitAll()

                        // Restrict access to /admin/** only for ADMIN role
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // Allow ADMIN and USER roles to access all other endpoints
                        .requestMatchers("/**").hasAnyRole("ADMIN", "USER")

                        // Require authentication for any other requests
                        .anyRequest().authenticated()
                )
                // Custom handling of exceptions which are being processed within security layer before the request reaches its endpoint
                // The exceptions will be resolved within common handlerExceptionResolver == processed by my own ExceptionHandlerAdvice (which ensures creation of proper ErrorDto).
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            handlerExceptionResolver.resolveException(request, response, null, accessDeniedException);
                        })
                        .authenticationEntryPoint((request, response, authException) -> {
                            handlerExceptionResolver.resolveException(request, response, null, authException);
                        })
                )
                // Add filter to handle custom security exceptions such as InvalidJwtTokenException
                //  - this filter ensures that these custom exceptions are not converted into more general exceptions and are directly handed over to common handlerExceptionResolver == processed by my own ExceptionHandlerAdvice
                .addFilterBefore(customSecurityExceptionHandlerFilter, UsernamePasswordAuthenticationFilter.class)
                // Add filter to process authentication using JWT token
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
