import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { useGeneralContext } from '../../../contexts/GeneralContext';
import HeaderPublic from '../../../components/common/navBar/HeaderPublic/HeaderPublic.tsx';
import Footer from '../../../components/common/Footer/Footer.tsx';
import CookieBanner from '../../../components/common/CookieBanner/CookieBanner.tsx';
import { publicLayoutStyles } from './styles.ts';

const PublicLayout: React.FC = () => {
  const { cookiesAccepted, setCookiesAccepted } = useGeneralContext();

  return (
    <Box sx={publicLayoutStyles.root}>
      <HeaderPublic />
      <Box component="main" sx={publicLayoutStyles.main}>
        <Outlet />
      </Box>
      <Footer />
      {!cookiesAccepted && (
        <CookieBanner
          onAccept={() => setCookiesAccepted(true)}
          onClose={() => setCookiesAccepted(false)}
        />
      )}
    </Box>
  );
};

export default PublicLayout;
