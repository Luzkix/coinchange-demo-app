import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Footer from '../../../components/common/Footer/Footer.tsx';
import { publicLayoutStyles } from '../PublicLayout/styles.ts';
import HeaderPrivate from '../../../components/common/navBar/HeaderPrivate/HeaderPrivate.tsx';

const PrivateLayout: React.FC = () => {
  return (
    <Box sx={publicLayoutStyles.root}>
      <HeaderPrivate />
      <Box component="main" sx={publicLayoutStyles.main}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default PrivateLayout;
