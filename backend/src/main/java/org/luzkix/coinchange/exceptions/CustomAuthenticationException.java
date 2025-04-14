package org.luzkix.coinchange.exceptions;

public class CustomAuthenticationException extends RuntimeException implements ErrorBusinessCodeProvider {
    private final ErrorBusinessCodeEnum errorBusinessCodeEnum;

    public CustomAuthenticationException(String message, ErrorBusinessCodeEnum errorBusinessCodeEnum) {
        super(message);
        this.errorBusinessCodeEnum = errorBusinessCodeEnum;
    }

    @Override
    public ErrorBusinessCodeEnum getErrorBusinessCode() {
        return errorBusinessCodeEnum;
    }
}