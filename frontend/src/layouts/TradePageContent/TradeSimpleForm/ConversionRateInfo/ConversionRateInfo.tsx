// src/layouts/TradePageContent/TradeSimpleForm/ConversionRateInfo/ConversionRateInfo.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { conversionInfoStyles } from './styles';
import { useTranslation } from 'react-i18next';

interface ConversionInfoProps {
  soldCurrency: string;
  boughtCurrency: string;
  rate: number;
  secondsLeft: number;
  isError: boolean;
}

const ConversionRateInfo: React.FC<ConversionInfoProps> = ({
  soldCurrency,
  boughtCurrency,
  rate,
  secondsLeft,
  isError,
}) => {
  const { t } = useTranslation('tradePage');
  const price = rate ? 1 / rate : 0;

  return (
    <Box sx={conversionInfoStyles.container}>
      {isError ? (
        <Typography color="error">{t('form.rateError')}</Typography>
      ) : (
        <>
          <Typography>
            {t('form.price')}:{' '}
            <b>
              {price > 1 ? price.toFixed(3) : price == 0 ? price.toFixed(0) : price.toFixed(8)}{' '}
              {soldCurrency}/{boughtCurrency}
            </b>
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
