import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { hotCoinsInfoStyles } from './styles.ts';
import ROUTES from '../../../../constants/routes.ts';

export const HotCoinsInfo: React.FC = () => {
  const { t } = useTranslation('homepage');

  return (
    <Box sx={hotCoinsInfoStyles.container}>
      <Typography variant="h2" sx={hotCoinsInfoStyles.title}>
        {t('hotCoins.title')}
      </Typography>

      <Typography variant="body1" sx={hotCoinsInfoStyles.subtitle}>
        {t('hotCoins.subtitle')}
      </Typography>

      <Button
        component={Link}
        to={ROUTES.CRYPTOCURRENCIES}
        variant="contained"
        color="primary"
        sx={hotCoinsInfoStyles.button}
      >
        {t('hotCoins.seeMoreAssets')}
      </Button>
    </Box>
  );
};

export default HotCoinsInfo;
