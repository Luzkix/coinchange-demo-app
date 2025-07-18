import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { introductionStyles } from './styles.ts';
import ROUTES from '../../../constants/routes.ts';
import { useAuth } from '../../../contexts/AuthContext.tsx';

const introPicture = '/intro_pic.webp';

export const Introduction: React.FC = () => {
  const { t } = useTranslation(['homepage']);
  const { userData } = useAuth();

  return (
    <Box sx={introductionStyles.container}>
      <Box sx={introductionStyles.imageContainer}>
        <img src={introPicture} alt="Intro picture" style={{ maxWidth: '75%', height: 'auto' }} />
      </Box>

      <Box sx={introductionStyles.content}>
        <Typography variant="h1" sx={introductionStyles.title}>
          {t('introduction.title')}
        </Typography>

        <Typography variant="body1" sx={introductionStyles.description}>
          {t('introduction.description')}
        </Typography>

        <Button
          component={Link}
          to={userData ? ROUTES.TRADE : ROUTES.SIGNUP}
          variant="contained"
          color="primary"
          size="large"
          sx={introductionStyles.signupButton}
        >
          {t(userData ? 'introduction.trade' : 'introduction.signUp')}
        </Button>
      </Box>
    </Box>
  );
};

export default Introduction;
