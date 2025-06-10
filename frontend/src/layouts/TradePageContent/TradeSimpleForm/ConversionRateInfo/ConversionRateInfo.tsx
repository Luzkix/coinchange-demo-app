// src/layouts/TradePageContent/TradeSimpleForm/ConversionRateInfo/ConversionRateInfo.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { conversionInfoStyles } from './styles';
import { useTranslation } from 'react-i18next';

interface ConversionInfoProps {
  rate: number;
  secondsLeft: number;
  isError: boolean;
}

const ConversionRateInfo: React.FC<ConversionInfoProps> = ({ rate, secondsLeft, isError }) => {
  const { t } = useTranslation('tradePage');

  return (
    <Box sx={conversionInfoStyles.container}>
      {isError ? (
        <Typography color="error">{t('form.rateError')}</Typography>
      ) : (
        <>
          <Typography>
            {t('form.rate')}: <b>{rate.toFixed(8)}</b>
          </Typography>
          <Typography sx={conversionInfoStyles.timer}>
            {secondsLeft > 0 ? `${t('form.validity')}: ${secondsLeft}s` : t('form.invalidRate')}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ConversionRateInfo;
