import React, { Suspense } from 'react';
import { hotCoinsStyles } from './styles.ts';
import { Box, CircularProgress } from '@mui/material';
import TopUsersInfo from './TopUsersInfo/TopUsersInfo.tsx';
import TopUsersTabs from './TopUsersTabs/TopUsersTabs.tsx';

export const TopUsers: React.FC = () => {
  return (
    <Box sx={{ ...hotCoinsStyles.container, mt: '2rem' }}>
      <TopUsersInfo />
      <Suspense fallback={<CircularProgress />}>
        <TopUsersTabs />
      </Suspense>
    </Box>
  );
};

export default TopUsers;
