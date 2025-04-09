package org.luzkix.coinchange.exceptions;

public class InvalidInputDataException extends RuntimeException implements ErrorBusinessCodeProvider {
    private final ErrorBusinessCodeEnum errorBusinessCodeEnum;

    public InvalidInputDataException(String message, ErrorBusinessCodeEnum errorBusinessCodeEnum) {
        super(message);
        this.errorBusinessCodeEnum = errorBusinessCodeEnum;
    }

    @Override
    public ErrorBusinessCodeEnum getErrorBusinessCode() {
        return errorBusinessCodeEnum;
    }
}