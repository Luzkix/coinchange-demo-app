import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { signUpFormStyles } from './styles';
import { useTranslation } from 'react-i18next';
import ModalLoaderBlocking from '../../components/common/ModalLoaderBlocking/ModalLoaderBlocking.tsx';
import TextFieldCustom from '../../components/common/TextFieldCustom/TextFieldCustom';

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => void;
  isLoading: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation(['signInSignUpPage']);
  const [form, setForm] = useState<SignUpFormData>({ username: '', email: '', password: '' });

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
      <TextFieldCustom
        label={t('signUp.username')}
        name="username"
        value={form.username}
        onChange={handleChange}
      />
      <TextFieldCustom
        label={t('signUp.email')}
        name="email"
        value={form.email}
        onChange={handleChange}
        type="email"
      />
      <TextFieldCustom
        label={t('signUp.password')}
        name="password"
        value={form.password}
        onChange={handleChange}
        type="password"
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
