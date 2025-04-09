package org.luzkix.coinchange.exceptions;

public class InvalidJwtTokenException extends RuntimeException implements ErrorBusinessCodeProvider {
    private final ErrorBusinessCodeEnum errorBusinessCodeEnum;

    public InvalidJwtTokenException(String message, ErrorBusinessCodeEnum errorBusinessCodeEnum) {
        super(message);
        this.errorBusinessCodeEnum = errorBusinessCodeEnum;
    }

    @Override
    public ErrorBusinessCodeEnum getErrorBusinessCode() {
        return errorBusinessCodeEnum;
    }
}