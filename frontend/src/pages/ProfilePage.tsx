import React, { useState } from 'react';
import ProfilePageContentForm from '../layouts/ProfilePageContentForm/ProfilePageContentForm.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserUpdateRequestDto } from '../api-generated/backend';
import { useUpdateUser } from '../hooks/useUpdateUser.ts';
import ROUTES from '../constants/routes.ts';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: updateUser, isPending } = useUpdateUser();
  const [updateIsSuccess, setUpdateIsSuccess] = useState(false);

  const handleUpdateUser = (formData: UserUpdateRequestDto) => {
    updateUser(formData, {
      onSuccess: () => {
        setUpdateIsSuccess(true);
        setTimeout(() => setUpdateIsSuccess(false), 5000);

        // ensures staying on the same page even if login function from authContext was used
        navigate(location.state?.from || ROUTES.PROFILE, { replace: true });
      },
    });
  };

  return (
    <ProfilePageContentForm
      onSubmit={handleUpdateUser}
      isLoading={isPending}
      updateIsSuccess={updateIsSuccess}
    />
  );
};

export default ProfilePage;
