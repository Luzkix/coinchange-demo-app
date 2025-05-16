import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignUpForm from '../layouts/SignUpForm/SignUpForm';
import { useRegisterUser } from '../hooks/useRegisterUser';
import ROUTES from '../constants/routes';
import { UserRegistrationRequestDto } from '../api-generated/backend';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: registerUser, isPending } = useRegisterUser();

  const handleSignUp = (formData: UserRegistrationRequestDto) => {
    registerUser(formData, {
      onSuccess: () => navigate(location.state?.from || ROUTES.PORTFOLIO, { replace: true }),
    });
  };

  return <SignUpForm onSubmit={handleSignUp} isLoading={isPending} />;
};

export default SignUpPage;
