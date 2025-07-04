import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext.tsx';
import { userMenuStyles } from './styles.ts';
import { useTranslation } from 'react-i18next';
import ROUTES from '../../../../constants/routes.ts';

const UserMenu: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { userData, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  // Get first letter of username, fallback to '?'
  const userInitial = userData?.username?.substring(0, 2)?.toUpperCase() || '?';

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate(ROUTES.PROFILE);
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <>
      <Tooltip title={t('header.userAccount')}>
        <IconButton
          onClick={handleOpen}
          aria-label="user menu"
          size="large"
          sx={userMenuStyles.iconButton}
        >
          <Box sx={userMenuStyles.iconStyles}>{userInitial}</Box>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleProfile}>{t('header.profile')}</MenuItem>
        <MenuItem onClick={handleLogout}>{t('header.logout')}</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
