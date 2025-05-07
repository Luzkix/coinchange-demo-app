import React, { Suspense } from 'react';
import { hotCoinsStyles } from './styles.ts';
import { Box, CircularProgress } from '@mui/material';
import HotCoinsInfo from './HotCoinsInfo/HotCoinsInfo.tsx';
import HotCoinsTabs from './HotCoinsTabs/HotCoinsTabs.tsx';

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
