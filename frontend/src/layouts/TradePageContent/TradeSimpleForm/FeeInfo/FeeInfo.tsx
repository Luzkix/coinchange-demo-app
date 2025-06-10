// src/layouts/TradePageContent/TradeSimpleForm/FeeInfo/FeeInfo.tsx
import React from 'react';
import { Typography } from '@mui/material';
import { feeInfoStyles } from './styles';
import { useTranslation } from 'react-i18next';

interface FeeInfoProps {
  feeAmount: number;
  boughtCurrency: string;
}

const FeeInfo: React.FC<FeeInfoProps> = ({ feeAmount, boughtCurrency }) => {
  const { t } = useTranslation(['tradePage']);

  return (
    <Typography sx={feeInfoStyles.root}>
      {t('form.fee')}: {feeAmount.toFixed(8)} {boughtCurrency}
    </Typography>
  );
};

export default FeeInfo;
