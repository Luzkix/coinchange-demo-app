package org.luzkix.coinchange.exceptions;

public class UnprocessableEntityException extends RuntimeException implements ErrorBusinessCodeProvider {
    private final ErrorBusinessCodeEnum errorBusinessCodeEnum;

    public UnprocessableEntityException(String message, ErrorBusinessCodeEnum errorBusinessCodeEnum) {
        super(message);
        this.errorBusinessCodeEnum = errorBusinessCodeEnum;
    }

    @Override
    public ErrorBusinessCodeEnum getErrorBusinessCode() {
        return errorBusinessCodeEnum;
    }
}