import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Footer from '../../../components/common/Footer/Footer.tsx';
import { publicLayoutStyles } from '../publicLayout/styles.ts';
import HeaderSignedIn from '../../../components/common/navBar/HeaderSignedIn/HeaderSignedIn.tsx';

const SignedInLayout: React.FC = () => {
  return (
    <Box sx={publicLayoutStyles.root}>
      <HeaderSignedIn />
      <Box component="main" sx={publicLayoutStyles.main}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default SignedInLayout;
