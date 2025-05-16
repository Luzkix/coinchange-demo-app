import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { signInFormStyles } from './styles';
import { useTranslation } from 'react-i18next';
import ModalLoaderBlocking from '../../components/common/ModalLoaderBlocking/ModalLoaderBlocking.tsx';
import TextFieldCustom from '../../components/common/TextFieldCustom/TextFieldCustom';
import { UserLoginRequestDto } from '../../api-generated/backend';

interface SignInFormProps {
  onSubmit: (data: UserLoginRequestDto) => void;
  isLoading: boolean;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation(['signInSignUpPage']);
  const [form, setForm] = useState<UserLoginRequestDto>({
    usernameOrEmail: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={signInFormStyles.formBox}>
      <Typography variant="h5" gutterBottom>
        {t('signIn.title')}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {t('signUp.titleDesc')}
      </Typography>
      <TextFieldCustom
        label={t('signIn.usernameOrEmail')}
        name="usernameOrEmail"
        value={form.usernameOrEmail}
        onChange={handleChange}
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
        sx={signInFormStyles.button}
      >
        {isLoading ? t('signIn.signingIn') : t('signIn.signIn')}
      </Button>
      <ModalLoaderBlocking isOpen={isLoading} />
    </Box>
  );
};

export default SignInForm;
