import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { customTextFieldStyles } from './styles';
import { SxProps, Theme } from '@mui/material/styles';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../../constants/customConstants.ts';
import { useTranslation } from 'react-i18next';

export type AllowedTypesForCustomTextField =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'search'
  | 'tel'
  | 'url';
export type AllowedMarginsForCustomTextField = 'none' | 'dense' | 'normal';

interface CustomTextFieldProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  name?: string;
  label?: string;
  margin?: AllowedMarginsForCustomTextField;
  required?: boolean;
  fullWidth?: boolean;
  type?: AllowedTypesForCustomTextField;
  sx?: SxProps<Theme>;
  customRegex?: RegExp;
  validateErrorMessage?: string;
  helperText?: string;
  isExternalError?: boolean;
  externalErrorMessage?: string;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  name,
  value,
  onChange,
  label,
  margin = 'normal',
  required = true,
  fullWidth = true,
  type = 'text',
  sx = customTextFieldStyles.input,
  customRegex,
  validateErrorMessage,
  helperText,
  isExternalError,
  externalErrorMessage,
  placeholder,
  disabled,
  ...rest
}) => {
  const { t } = useTranslation(['errors']);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // for text types email and password use predefined regex if not overridden by customRegex
  const regexToValidate =
    type === 'email' && !customRegex
      ? EMAIL_REGEX
      : type === 'password' && !customRegex
        ? PASSWORD_REGEX
        : customRegex;

  const validateField = (value: string) => {
    if (!value || !regexToValidate) return true;
    return regexToValidate.test(value);
  };

  //action when user leaves the text field
  const handleBlur = () => {
    // Validate when leaving text field
    if (!validateField(value)) {
      setIsError(true);
      if (type === 'email') {
        setErrorMessage(t('message.emailFormatError'));
      } else if (type === 'password' && validateErrorMessage) {
        setErrorMessage(validateErrorMessage); //if type 'password' has custom validateErrorMessage, use it
      } else if (type === 'password') {
        setErrorMessage(t('message.passwordFormatError'));
      } else {
        setErrorMessage(validateErrorMessage || t('message.invalidValueError'));
      }
    } else {
      setIsError(false);
      setErrorMessage('');
    }
  };

  // action when user sends the form with invalid text values
  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsError(true);

    // Keep existing error message intact if already set
    if (errorMessage && isError) {
    }
    // Use default messages pro email/password types or validateErrorMessages for other types
    else if (type === 'email' && e.currentTarget.validity.typeMismatch) {
      setErrorMessage(t('message.emailFormatError'));
    } else if (
      type === 'password' &&
      validateErrorMessage &&
      regexToValidate &&
      !regexToValidate.test(e.currentTarget.value)
    ) {
      setErrorMessage(validateErrorMessage); //if type 'password' has custom validateErrorMessage, use it
    } else if (type === 'password' && e.currentTarget.validity.typeMismatch) {
      setErrorMessage(t('message.passwordFormatError'));
    } else if (regexToValidate && !regexToValidate.test(e.currentTarget.value)) {
      setErrorMessage(validateErrorMessage || t('message.invalidValueError'));
    } else {
      setErrorMessage(t('message.fieldIsObligatoryError'));
    }

    e.currentTarget.setCustomValidity(errorMessage);
  };

  // action when user is typing something into the text field
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    // Resetting error messages and error format (red boarder box) when input field changes and becomes valid
    if (validateField(e.currentTarget.value)) {
      setIsError(false);
      setErrorMessage('');
      e.currentTarget.setCustomValidity('');
    }
  };

  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={(e) => {
        onChange && onChange(e);
        // When input changes and was error, then re-validate using handleInput function
        if (isError) {
          handleInput(e as React.FormEvent<HTMLInputElement>);
        }
      }}
      onBlur={handleBlur}
      margin={margin}
      required={required}
      fullWidth={fullWidth}
      type={type}
      sx={sx}
      error={isExternalError || isError}
      helperText={
        isExternalError && externalErrorMessage
          ? externalErrorMessage
          : isError
            ? errorMessage
            : helperText
              ? helperText
              : ''
      }
      slotProps={{
        htmlInput: {
          pattern: regexToValidate?.source,
          onInvalid: handleInvalid,
          onInput: handleInput,
        },
      }}
      placeholder={placeholder}
      disabled={disabled}
      {...rest}
    />
  );
};

export default CustomTextField;
