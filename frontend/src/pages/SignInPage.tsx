import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserLoginRequestDto } from '../api-generated/backend';
import ROUTES from '../constants/routes.ts';
import SignInForm from '../layouts/SignInForm/SignInForm.tsx';
import { useLoginUser } from '../hooks/useLoginUser.ts';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: loginUser, isPending } = useLoginUser();

  const handleSignIn = (formData: UserLoginRequestDto) => {
    loginUser(formData, {
      onSuccess: () => navigate(location.state?.from || ROUTES.PORTFOLIO, { replace: true }),
    });
  };

  return <SignInForm onSubmit={handleSignIn} isLoading={isPending} />;
};

export default SignInPage;
