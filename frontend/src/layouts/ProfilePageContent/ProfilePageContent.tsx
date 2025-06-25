import React, { useState } from 'react';
import { Box, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { profilePageStyles } from './styles';
import { useUpdateUser } from '../../hooks/useUpdateUser.ts';
import { UserUpdateRequestDto } from '../../api-generated/backend';
import ROUTES from '../../constants/routes.ts';
import ProfilePageContentForm from './ProfilePageContentForm/ProfilePageContentForm.tsx';
import TransactionsHistoryContent from './TransactionsHistoryContent/TransactionsHistoryContent.tsx';
import ContentBoxLarge from '../../components/ui/ContentBoxLarge/ContentBoxLarge.tsx';
import { useTranslation } from 'react-i18next';

enum ProfileSection {
  PROFILE = 'PROFILE',
  TRANSACTIONS = 'TRANSACTIONS',
}

const ProfilePageContent: React.FC = () => {
  const { t } = useTranslation(['profilePage', 'transactionTable']);
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: updateUser, isPending } = useUpdateUser();
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

  return (
    <ContentBoxLarge>
      <Box sx={profilePageStyles.root}>
        {/* Side navigation panel */}
        <Paper elevation={1} sx={profilePageStyles.sidePanel}>
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
    </ContentBoxLarge>
  );
};

export default ProfilePageContent;
