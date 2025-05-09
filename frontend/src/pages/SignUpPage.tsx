// src/pages/SignUpPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import SignUpForm, { SignUpFormData } from '../layouts/SignUpForm/SignUpForm';
import {
  ApiUserService,
  ErrorDto,
  UserLoginResponseDto,
  UserRegistrationRequestDto,
} from '../api-generated/backend';
import { useAuth } from '../contexts/AuthContext';
import { useGeneralContext } from '../contexts/GeneralContext';
import ROUTES from '../constants/routes';

// Funkce pro registraci uživatele s typováním
const registerUser = async (data: UserRegistrationRequestDto): Promise<UserLoginResponseDto> => {
  return await ApiUserService.createUser(data);
};

const SignUpPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addErrorModal, addErrorPopup } = useGeneralContext();

  // useMutation s typováním
  const mutation = useMutation<UserLoginResponseDto, ErrorDto, UserRegistrationRequestDto>({
    mutationFn: registerUser,
    onSuccess: (data: UserLoginResponseDto) => {
      // Přihlásit uživatele a uložit token
      login(data.jwtToken, {
        id: data.id,
        email: data.email,
        roles: data.roles?.map((r) => r.roleName) ?? [],
      });
      navigate(ROUTES.PORTFOLIO);
    },
    onError: (error: ErrorDto) => {
      // Pokud je error ve formě ErrorDto a je vyplněno errorBusinessCode, zobrazit ErrorModal
      if (error && error.errorBusinessCode) {
        addErrorModal(error.errorMessage ?? '', error.errorStatus);
      } else {
        addErrorPopup(error?.errorMessage || 'Neočekávaná chyba při registraci.');
        // Log error to console
        console.error(error);
      }
    },
  });

  // Převod dat z formuláře na UserRegistrationRequestDto
  const handleSignUp = (formData: SignUpFormData) => {
    const dto: UserRegistrationRequestDto = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };
    mutation.mutate(dto);
  };

  return <SignUpForm onSubmit={handleSignUp} isLoading={mutation.isPending} />;
};

export default SignUpPage;
