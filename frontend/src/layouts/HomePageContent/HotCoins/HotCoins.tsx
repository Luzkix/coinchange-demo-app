import React, { Suspense } from 'react';
import HotCoinsInfo from './HotCoinsInfo';
import HotCoinsTabs from './HotCoinsTabs';
import { hotCoinsStyles } from './styles.ts';
import { Box, CircularProgress } from '@mui/material';

export const HotCoins: React.FC = () => {
  return (
    <Box sx={hotCoinsStyles.container}>
      <HotCoinsInfo />
      <Suspense fallback={<CircularProgress />}>
        <HotCoinsTabs />
      </Suspense>
    </Box>
  );
};

export default HotCoins;
