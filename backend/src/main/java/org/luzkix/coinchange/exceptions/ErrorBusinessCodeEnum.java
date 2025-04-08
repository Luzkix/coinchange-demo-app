package org.luzkix.coinchange.exceptions;

public enum ErrorBusinessCodeEnum {
    INVALID_USERNAME("INVALID_USERNAME", "Username is null or empty"),
    INVALID_EMAIL_FORMAT("INVALID_EMAIL_FORMAT", "Invalid email format"),
    INVALID_PASSWORD_FORMAT("INVALID_PASSWORD_FORMAT", "Invalid password format"),
    USER_ALREADY_EXISTS("USER_ALREADY_EXISTS", "User with same username/email and with active account already exists");


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
