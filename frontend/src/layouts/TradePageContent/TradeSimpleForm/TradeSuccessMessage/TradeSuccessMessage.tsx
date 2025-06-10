// src/layouts/TradePageContent/TradeSimpleForm/TradeSuccessMessage/TradeSuccessMessage.tsx
import React from 'react';
import { Typography } from '@mui/material';
import { tradeSuccessMessageStyles } from './styles';

const TradeSuccessMessage: React.FC = () => (
  <Typography sx={tradeSuccessMessageStyles.root}>Exchange was successfully processed!</Typography>
);

export default TradeSuccessMessage;
