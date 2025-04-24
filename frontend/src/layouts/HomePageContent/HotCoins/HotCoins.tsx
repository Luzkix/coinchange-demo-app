import React from 'react';
import HotCoinsInfo from './HotCoinsInfo';
import HotCoinsTabs from './HotCoinsTabs';
import { hotCoinsStyles } from './styles.ts';
import { Box } from '@mui/material';

export const HotCoins: React.FC = () => {
  return (
    <Box sx={hotCoinsStyles.container}>
      <HotCoinsInfo />
      <HotCoinsTabs />
    </Box>
  );
};

export default HotCoins;
