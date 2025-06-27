import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { hotCoinsInfoStyles } from './styles.ts';
import ROUTES from '../../../../constants/routes.ts';

export const TopUsersInfo: React.FC = () => {
  const { t } = useTranslation(['homePagePrivate']);

  return (
    <Box sx={hotCoinsInfoStyles.container}>
      <Typography variant="h2" sx={hotCoinsInfoStyles.title}>
        {t('hotUsers.title')}
      </Typography>

      <Typography variant="body1" sx={hotCoinsInfoStyles.subtitle}>
        {t('hotUsers.subtitle')}
      </Typography>

      <Button
        component={Link}
        to={ROUTES.TRADE}
        variant="contained"
        color="primary"
        sx={hotCoinsInfoStyles.button}
      >
        {t('hotUsers.trade')}
      </Button>
    </Box>
  );
};

export default TopUsersInfo;
