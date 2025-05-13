// src/pages/SignUpPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm, { SignUpFormData } from '../layouts/SignUpForm/SignUpForm';
import { useRegisterUser } from '../hooks/useRegisterUser';
import ROUTES from '../constants/routes';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegisterUser();

  const handleSignUp = (formData: SignUpFormData) => {
    mutate(formData, {
      onSuccess: () => navigate(ROUTES.PORTFOLIO),
    });
  };

  return <SignUpForm onSubmit={handleSignUp} isLoading={isPending} />;
};

export default SignUpPage;
