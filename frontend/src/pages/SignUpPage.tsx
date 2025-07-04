import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignUpForm from '../layouts/SignUpForm/SignUpForm';
import { useRegisterUser } from '../hooks/useRegisterUser';
import ROUTES from '../constants/routes';
import { UserRegistrationRequestDto } from '../api-generated/backend';
import { useGeneralContext } from '../contexts/GeneralContext.tsx';
import { useTranslation } from 'react-i18next';
import { INITIAL_BONUS_AMOUNT, INITIAL_BONUS_CURRENCY } from '../constants/configVariables.ts';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: registerUser, isPending } = useRegisterUser();
  const { addErrorModal } = useGeneralContext();
  const { t } = useTranslation(['signInSignUpPage']);

  const handleSignUp = (formData: UserRegistrationRequestDto) => {
    registerUser(formData, {
      onSuccess: () => {
        navigate(location.state?.from || ROUTES.PORTFOLIO, { replace: true });

        //using error modal for displaying modal window with congratulations information about credited signup bonus
        addErrorModal(
          t('signUp.congratulationMessage') +
            INITIAL_BONUS_AMOUNT +
            ' ' +
            INITIAL_BONUS_CURRENCY +
            '!!!',
          t('signUp.congratulationTitle'),
        );
      },
    });
  };

  return <SignUpForm onSubmit={handleSignUp} isLoading={isPending} />;
};

export default SignUpPage;
