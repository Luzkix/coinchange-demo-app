package org.luzkix.coinchange.exceptions;

public enum ErrorBusinessCodeEnum {
    NULL_OR_EMPTY("NULL_OR_EMPTY", "Input field is null or empty."),
    INVALID_USERNAME("INVALID_USERNAME", "Username is null or empty."),
    INVALID_EMAIL_FORMAT("INVALID_EMAIL_FORMAT", "Invalid email format."),
    INVALID_PASSWORD_FORMAT("INVALID_PASSWORD_FORMAT", "Invalid password format."),
    INCORRECT_PASSWORD("INCORRECT_PASSWORD", "Provided password does not match user password."),
    USER_ALREADY_EXISTS("USER_ALREADY_EXISTS", "User with same username/email and with active account already exists."),
    USER_NOT_FOUND("USER_NOT_FOUND", "User with active account does not exist for provided username/email."),
    INVALID_JWT_TOKEN("INVALID_JWT_TOKEN", "JWT token has invalid structure or was expired."),
    INVALID_USER_ROLE("INVALID_USER_ROLE", "User role is invalid/unknown."),
    ACCESS_DENIED("ACCESS_DENIED", "User has insufficient access rights to perform the action."),
    AUTHENTICATION_GENERAL_FAILURE("AUTHENTICATION_GENERAL_FAILURE", "Unable to authenticate the user (e.g. missing authentication token, etc.)."),
    ENTITY_NOT_FOUND("ENTITY_NOT_FOUND", "Required entity/object was not found in database."),
    EXTERNAL_API_ERROR("EXTERNAL_API_ERROR", "Unknown error while querying external API."),
    CONVERSION_RATE_EXPIRED("CONVERSION_RATE_EXPIRED", "Validity of conversion rate already expired. New conversion rate needs to be requested."),
    INSUFFICIENT_BALANCE("INSUFFICIENT_BALANCE", "Balance in sold currency is insufficient for processing of currency conversion."),
    CONVERSION_TRANSACTION_FAILURE("CONVERSION_TRANSACTION_FAILURE", "Something went wrong while preparing/updating currency conversion transaction."),
    CANCELLATION_TRANSACTION_FAILURE("CANCELLATION_TRANSACTION_FAILURE", "Transaction cannot be cancelled! It was already processed or cancelled or some unknown error occurred during cancellation.");



    private final String code;
    private final String message;

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
