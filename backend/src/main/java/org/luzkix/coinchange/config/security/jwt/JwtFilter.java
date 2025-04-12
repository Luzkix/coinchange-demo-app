package org.luzkix.coinchange.config.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.luzkix.coinchange.config.security.CustomUserDetails;
import org.luzkix.coinchange.config.security.CustomUserDetailsService;
import org.luzkix.coinchange.exceptions.InvalidJwtTokenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
//@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        //1.checking if request is provided with bearer token
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer")) {
            filterChain.doFilter(request, response);
            return;
        }
        //2. if so, extracting token from request and checking its validity
        String token = getTokenFromRequest(request);
        Long userId = validateToken(token);

        //3. if it is valid, setting security context with all required info.
        authenticateUser(userId);

        //4. if everything ok, perform doFilter
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private Long validateToken(String token) {
        try {
            //method getUserIdFromToken performs both token validation and userId extraction
            return jwtProvider.getUserIdFromToken(token);
        } catch (InvalidJwtTokenException e) {
            SecurityContextHolder.clearContext();
            throw e;
        }
    }

    private void authenticateUser(Long userId) {
        // Loading CustomUserDetails, putting it into authentication and setting it into context
        CustomUserDetails customUserDetails = customUserDetailsService.loadUserByUsername(userId.toString());
        PreAuthenticatedAuthenticationToken authentication =
                new PreAuthenticatedAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        //log.info("Authenticated user: {}", customUserDetails.getUsername());
        System.out.printf("Authenticated user: %s%n", customUserDetails.getUsername());
    }
}
