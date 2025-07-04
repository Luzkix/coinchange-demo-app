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
                        // 1) Povolit veřejné REST API pro login/register, měny a dotazy na coinbase api
                        .requestMatchers("/api/user/login", "/api/user/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/currency", "/api/coinbase/**").permitAll()
                        // 2) Veškeré ostatní /api/** chránit
                        .requestMatchers("/api/**").hasAnyRole("ADMIN", "USER")
                        // 3) Všechny ostatní GET requesty (včetně všech frontend ui volání) povolit
                        .requestMatchers(HttpMethod.GET, "/**").permitAll()
                        // 4) Fallback pro ostatní požadavky
                        .anyRequest().authenticated()
                )

                // Custom handling of exceptions which are being processed within security layer before the request reaches its endpoint
                // The exceptions will be resolved within common handlerExceptionResolver == processed by my own ExceptionHandlerAdvice (which ensures creation of proper ErrorDto).
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                handlerExceptionResolver.resolveException(request, response, null, accessDeniedException)
                        )
                        .authenticationEntryPoint((request, response, authException) ->
                                handlerExceptionResolver.resolveException(request, response, null, authException)
                        )
                )
                // Add filter to handle custom security exceptions such as InvalidJwtTokenException
                //  - this filter ensures that these custom exceptions are not converted into more general exceptions and are directly handed over to common handlerExceptionResolver == processed by my own ExceptionHandlerAdvice
                .addFilterBefore(customSecurityExceptionHandlerFilter, UsernamePasswordAuthenticationFilter.class)
                // Add filter to process authentication using JWT token
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
