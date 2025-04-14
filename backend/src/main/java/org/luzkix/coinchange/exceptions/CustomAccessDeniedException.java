package org.luzkix.coinchange.exceptions;

public class CustomAccessDeniedException extends RuntimeException implements ErrorBusinessCodeProvider {
    private final ErrorBusinessCodeEnum errorBusinessCodeEnum;

    public CustomAccessDeniedException(String message, ErrorBusinessCodeEnum errorBusinessCodeEnum) {
        super(message);
        this.errorBusinessCodeEnum = errorBusinessCodeEnum;
    }

    @Override
    public ErrorBusinessCodeEnum getErrorBusinessCode() {
        return errorBusinessCodeEnum;
    }
}