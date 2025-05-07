import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { useGeneralContext } from '../../../contexts/GeneralContext';
import HeaderPublic from '../../../components/common/HeaderPublic/HeaderPublic.tsx';
import Footer from '../../../components/common/Footer/Footer.tsx';
import CookieBanner from '../../../components/common/CookieBanner/CookieBanner.tsx';

const PublicLayout: React.FC = () => {
  const { cookiesAccepted, setCookiesAccepted } = useGeneralContext();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <HeaderPublic />
      <Box component="main" sx={{ flexGrow: 1 }}>
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
