package org.luzkix.coinchange.exceptions;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CustomSecurityExceptionHandlerFilter extends OncePerRequestFilter {
    private final HandlerExceptionResolver handlerExceptionResolver;

    public CustomSecurityExceptionHandlerFilter(HandlerExceptionResolver handlerExceptionResolver) {
        this.handlerExceptionResolver = handlerExceptionResolver;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (InvalidJwtTokenException e) {
            // All exceptions from security layer will be resolved within common handlerExceptionResolver, i.e. by ExceptionHandlerAdvice
            // This ensures that the custom ErrorDTO is always returned in response even from security layer
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }
}
