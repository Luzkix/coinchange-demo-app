package org.luzkix.coinchange.utils.validations;

import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidInputDataException;

import java.util.Objects;

public class BusinessValidations {

    public static boolean isFieldNotNullOrEmpty(Object field, String customErrorMessage) {
        if (field == null) {
            throw new InvalidInputDataException(Objects.nonNull(customErrorMessage) ? customErrorMessage : ErrorBusinessCodeEnum.NULL_OR_EMPTY.getMessage(), ErrorBusinessCodeEnum.NULL_OR_EMPTY);
        }
        if (field instanceof String && ((String) field).trim().isEmpty()) {
            throw new InvalidInputDataException(Objects.nonNull(customErrorMessage) ? customErrorMessage : ErrorBusinessCodeEnum.NULL_OR_EMPTY.getMessage(), ErrorBusinessCodeEnum.NULL_OR_EMPTY);
        }
        return true;
    }

    public static boolean isValidUsername(String username, String customErrorMessage) {
        if (username == null || username.trim().isEmpty()) {
            throw new InvalidInputDataException(Objects.nonNull(customErrorMessage) ? customErrorMessage : ErrorBusinessCodeEnum.INVALID_USERNAME.getMessage(), ErrorBusinessCodeEnum.INVALID_USERNAME);
        }
        return true;
    }

    public static boolean isValidEmail(String email, String customErrorMessage) {
        if (email == null || !email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new InvalidInputDataException(Objects.nonNull(customErrorMessage) ? customErrorMessage : ErrorBusinessCodeEnum.INVALID_EMAIL_FORMAT.getMessage(), ErrorBusinessCodeEnum.INVALID_EMAIL_FORMAT);
        }
        return true;
    }

    public static boolean isValidPassword(String password, String customErrorMessage) {
        if (password == null || password.length() < 4) {
            throw new InvalidInputDataException(Objects.nonNull(customErrorMessage) ? customErrorMessage : ErrorBusinessCodeEnum.INVALID_PASSWORD_FORMAT.getMessage(), ErrorBusinessCodeEnum.INVALID_PASSWORD_FORMAT);
        }
        return true;
    }
}
