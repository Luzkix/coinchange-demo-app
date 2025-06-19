import React from 'react';
import { Typography } from '@mui/material';
import { feeInfoStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { CurrencyResponseDto } from '../../../../api-generated/backend';

interface FeeInfoProps {
  feeAmount: number;
  boughtCurrency: CurrencyResponseDto | null;
}

const FeeInfo: React.FC<FeeInfoProps> = ({ feeAmount, boughtCurrency }) => {
  const { t } = useTranslation(['tradePage']);

  return (
    <Typography sx={feeInfoStyles.root}>
      {t('form.fee')}: {feeAmount.toFixed(8)} {boughtCurrency?.code}
    </Typography>
  );
};

export default FeeInfo;
