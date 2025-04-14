package org.luzkix.coinchange.exceptions;

public enum ErrorBusinessCodeEnum {
    NULL_OR_EMPTY("NULL_OR_EMPTY", "Input field is null or empty"),
    INVALID_USERNAME("INVALID_USERNAME", "Username is null or empty"),
    INVALID_EMAIL_FORMAT("INVALID_EMAIL_FORMAT", "Invalid email format"),
    INVALID_PASSWORD_FORMAT("INVALID_PASSWORD_FORMAT", "Invalid password format"),
    INCORRECT_PASSWORD("INCORRECT_PASSWORD", "Provided password does not match user password"),
    USER_ALREADY_EXISTS("USER_ALREADY_EXISTS", "User with same username/email and with active account already exists"),
    USER_NOT_FOUND("USER_NOT_FOUND", "User with active account does not exist for provided username/email"),
    INVALID_JWT_TOKEN("INVALID_JWT_TOKEN", "JWT token has invalid structure or was expired"),
    INVALID_USER_ROLE("INVALID_USER_ROLE", "User role is invalid/unknown"),
    ACCESS_DENIED("ACCESS_DENIED", "User has insufficient access rights to perform the action"),
    AUTHENTICATION_GENERAL_FAILURE("AUTHENTICATION_GENERAL_FAILURE", "Unable to authenticate the user (e.g. missing authentication token, etc.)");



    private String code;
    private String message;

    ErrorBusinessCodeEnum(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return this.code;
    }

    public String getMessage() {
        return message;
    }

    public static ErrorBusinessCodeEnum getCodeFromValue(String value) {
        for (ErrorBusinessCodeEnum enumCode : ErrorBusinessCodeEnum.values()) {
            if (String.valueOf(enumCode.getCode()).equals(value)) {
                return enumCode;
            }
        }
        return null;
    }
}
