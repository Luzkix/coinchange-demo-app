import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { signUpFormStyles } from './styles';
import { useTranslation } from 'react-i18next';
import ModalLoaderBlocking from '../../components/common/ModalLoaderBlocking/ModalLoaderBlocking.tsx';
import CustomTextField from '../../components/common/CustomTextField/CustomTextField.tsx';
import { UserRegistrationRequestDto } from '../../api-generated/backend';

interface SignUpFormProps {
  onSubmit: (data: UserRegistrationRequestDto) => void;
  isLoading: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation(['signInSignUpPage']);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const passwordConfirmationRegex = new RegExp(
    '^' + form.password.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', //regex is used for checking whether password matches passwordConfirm
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={signUpFormStyles.formBox}>
      <Typography variant="h5" gutterBottom>
        {t('signUp.title')}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {t('signUp.titleDesc')}
      </Typography>
      <CustomTextField
        label={t('signUp.username')}
        name="username"
        value={form.username}
        onChange={handleChange}
      />
      <CustomTextField
        label={t('signUp.email')}
        name="email"
        value={form.email}
        onChange={handleChange}
        type="email"
      />
      <CustomTextField
        label={t('signUp.password')}
        name="password"
        value={form.password}
        onChange={handleChange}
        type="password"
      />
      <CustomTextField
        name="passwordConfirm"
        label={t('signUp.passwordConfirm')}
        value={form.passwordConfirm}
        onChange={handleChange}
        type="password"
        customRegex={passwordConfirmationRegex}
        validateErrorMessage={t('signUp.passwordsDoNotMatch')}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={signUpFormStyles.button}
      >
        {isLoading ? t('signUp.registering') : t('signUp.register')}
      </Button>
      <ModalLoaderBlocking isOpen={isLoading} />
    </Box>
  );
};

export default SignUpForm;
