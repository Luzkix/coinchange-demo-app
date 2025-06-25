import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext.tsx';
import { profilePageStyles } from './styles.ts';
import { useTranslation } from 'react-i18next';

import { UserUpdateRequestDto } from '../../../api-generated/backend';
import CustomTextField from '../../../components/common/CustomTextField/CustomTextField.tsx';
import ModalLoaderBlocking from '../../../components/common/ModalLoaderBlocking/ModalLoaderBlocking.tsx';

interface ProfilePageContentFormProps {
  onSubmit: (data: UserUpdateRequestDto) => void;
  isLoading: boolean;
  updateIsSuccess: boolean;
}

const ProfilePageContentForm: React.FC<ProfilePageContentFormProps> = ({
  onSubmit,
  isLoading,
  updateIsSuccess,
}) => {
  const { t } = useTranslation(['profilePage', 'signInSignUpPage']);
  const { userData } = useAuth();

  const initialForm = {
    username: userData?.username ?? '',
    email: userData?.email ?? '',
    password: '',
    passwordConfirm: '',
  };

  const [form, setForm] = useState(initialForm);

  const passwordConfirmationRegex = new RegExp(
    '^' + form.password.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', //regex is used for checking whether password matches passwordConfirm
  );

  const [isAnyFieldChanged, setIsAnyFieldChanged] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  // Reset of the form when change in updateIsSuccess
  useEffect(() => {
    setForm({
      username: userData?.username ?? '',
      email: userData?.email ?? '',
      password: '',
      passwordConfirm: '',
    });
  }, [updateIsSuccess]);

  // Detect changes in form fields
  useEffect(() => {
    const changed =
      form.username.trim() !== (userData?.username.trim() ?? '') ||
      form.email.trim() !== (userData?.email.trim() ?? '') ||
      form.password.trim() !== '';
    setIsAnyFieldChanged(changed);

    const changedPassword = form.password.trim() !== '';
    setIsPasswordChanged(changedPassword);
  }, [form, userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Creating UserUpdateRequestDto only with updated fields
    const dto: UserUpdateRequestDto = {};
    if (form.username.trim() !== (userData?.username.trim() ?? ''))
      dto.username = form.username.trim();
    if (form.email.trim() !== (userData?.email.trim() ?? '')) dto.email = form.email.trim();
    if (form.password.trim() !== '') dto.password = form.password;
    onSubmit(dto);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={profilePageStyles.container}>
      <CustomTextField
        label={t('signInSignUpPage:signUp.username')}
        name="username"
        value={form.username}
        onChange={handleChange}
        helperText={t('profilePage.usernameHelper')}
        required={false}
      />
      <CustomTextField
        label={t('signInSignUpPage:signUp.email')}
        name="email"
        value={form.email}
        onChange={handleChange}
        type="email"
        helperText={t('profilePage.emailHelper')}
        required={false}
      />
      <CustomTextField
        label={t('profilePage.newPassword')}
        name="password"
        value={form.password}
        onChange={handleChange}
        type="password"
        helperText={t('profilePage.passwordHelper')}
        required={false}
      />

      {isPasswordChanged && (
        <CustomTextField
          name="passwordConfirm"
          label={t('signInSignUpPage:signUp.passwordConfirm')}
          value={form.passwordConfirm}
          onChange={handleChange}
          type="password"
          customRegex={passwordConfirmationRegex}
          validateErrorMessage={t('signInSignUpPage:signUp.passwordsDoNotMatch')}
        />
      )}

      <Box sx={profilePageStyles.feeInfo}>
        <Typography variant="body2">
          <strong>{t('profilePage.feeCategory')}:</strong> {userData?.feeCategory ?? '-'}
        </Typography>
        <Typography variant="body2">
          <strong>{t('profilePage.feeRate')}:</strong>{' '}
          {userData?.feeRate != null ? `${userData.feeRate * 100}%` : '-'}
        </Typography>
        <Typography variant="body2">
          <strong>{t('profilePage.roles')}:</strong> {userData?.roles.join(', ') ?? '-'}
        </Typography>
      </Box>

      {isAnyFieldChanged && (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          fullWidth
          sx={profilePageStyles.buttonStyle}
        >
          {isLoading ? t('profilePage.saving') : t('profilePage.saveChanges')}
        </Button>
      )}

      {updateIsSuccess && (
        <Typography sx={profilePageStyles.messageStyle} color="success.main">
          {t('profilePage.updateConfirmation')}
        </Typography>
      )}

      <ModalLoaderBlocking isOpen={isLoading} />
    </Box>
  );
};

export default ProfilePageContentForm;
