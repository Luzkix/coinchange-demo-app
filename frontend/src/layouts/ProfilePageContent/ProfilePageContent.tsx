import React, { useState } from 'react';
import { Box, Button, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { profilePageStyles } from './styles';
import { useUpdateUser } from '../../hooks/useUpdateUser.ts';
import { UserUpdateRequestDto } from '../../api-generated/backend';
import ROUTES from '../../constants/routes.ts';
import ProfilePageContentForm from './ProfilePageContentForm/ProfilePageContentForm.tsx';
import TransactionsHistoryContent from './TransactionsHistoryContent/TransactionsHistoryContent.tsx';
import ContentBoxLarge from '../../components/ui/ContentBoxLarge/ContentBoxLarge.tsx';
import { useTranslation } from 'react-i18next';
import { useSuspendUser } from '../../hooks/useSuspendUser.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import ModalLoaderBlocking from '../../components/common/ModalLoaderBlocking/ModalLoaderBlocking.tsx';
import { useGeneralContext } from '../../contexts/GeneralContext.tsx';

enum ProfileSection {
  PROFILE = 'PROFILE',
  TRANSACTIONS = 'TRANSACTIONS',
}

const ProfilePageContent: React.FC = () => {
  const { t } = useTranslation(['profilePage', 'transactionTable']);
  const { userData, logout } = useAuth();
  const isAdmin = !!userData?.roles?.includes('ADMIN');
  const { addErrorModal } = useGeneralContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: updateUser, isPending } = useUpdateUser();
  const { mutate: suspendUser, isPending: isPendingSuspendUser } = useSuspendUser();
  const [updateIsSuccess, setUpdateIsSuccess] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ProfileSection>(ProfileSection.PROFILE);

  const handleUpdateUser = (formData: UserUpdateRequestDto) => {
    updateUser(formData, {
      onSuccess: () => {
        setUpdateIsSuccess(true);
        setTimeout(() => setUpdateIsSuccess(false), 5000);
        navigate(location.state?.from || ROUTES.PROFILE, { replace: true });
      },
    });
  };

  const handleCancelAccount = () => {
    suspendUser(undefined, {
      onSuccess: () => {
        logout();
        addErrorModal(
          t('profilePage:profilePage.cancelAccountConfirmationMessage'),
          t('profilePage:profilePage.cancelAccountConfirmationTitle'),
        );
      },
    });
  };

  return (
    <ContentBoxLarge>
      <Box sx={profilePageStyles.root}>
        {/* Side navigation panel */}

        <Box sx={profilePageStyles.sidePanel}>
          <Paper elevation={1} sx={profilePageStyles.menu}>
            <List component="nav" sx={profilePageStyles.navList}>
              <ListItemButton
                selected={selectedSection === ProfileSection.PROFILE}
                onClick={() => setSelectedSection(ProfileSection.PROFILE)}
                sx={profilePageStyles.navItem}
              >
                <ListItemText primary={t('profilePage:profilePage.title')} />
              </ListItemButton>
              <ListItemButton
                selected={selectedSection === ProfileSection.TRANSACTIONS}
                onClick={() => setSelectedSection(ProfileSection.TRANSACTIONS)}
                sx={profilePageStyles.navItem}
              >
                <ListItemText primary={t('transactionTable:common.headerAll')} />
              </ListItemButton>
            </List>
          </Paper>

          {!isAdmin && (
            <Button onClick={handleCancelAccount} sx={profilePageStyles.cancelAccountButton}>
              {t('profilePage:profilePage.cancelAccount')}
            </Button>
          )}
        </Box>

        {/* Main content */}
        <Box sx={profilePageStyles.main}>
          {selectedSection === ProfileSection.PROFILE && (
            <ProfilePageContentForm
              onSubmit={handleUpdateUser}
              isLoading={isPending}
              updateIsSuccess={updateIsSuccess}
            />
          )}
          {selectedSection === ProfileSection.TRANSACTIONS && <TransactionsHistoryContent />}
        </Box>
      </Box>
      <ModalLoaderBlocking isOpen={isPendingSuspendUser} />
    </ContentBoxLarge>
  );
};

export default ProfilePageContent;
