// src/layouts/TradePageContent/TradeSimpleForm/ConversionRateInfo/ConversionRateInfo.tsx
import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { conversionInfoStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { CurrencyResponseDto } from '../../../../api-generated/backend';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

interface ConversionInfoProps {
  soldCurrency: CurrencyResponseDto | null;
  boughtCurrency: CurrencyResponseDto | null;
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

  const [isReversedRate, setIsReversedRate] = useState(true);

  const reversedRate = rate ? 1 / rate : 0;
  const displayedCurrenciesReversedRate = soldCurrency?.code + '/' + boughtCurrency?.code;
  const displayedCurrenciesOriginalRate = boughtCurrency?.code + '/' + soldCurrency?.code;

  const handleSwapReversedRate = () => {
    if (isReversedRate) {
      setIsReversedRate(false);
    } else setIsReversedRate(true);
  };

  return (
    <Box sx={conversionInfoStyles.container}>
      {isError ? (
        <Typography color="error">{t('form.rateError')}</Typography>
      ) : (
        <>
          <Typography>
            {t('form.price')}:{' '}
            <IconButton onClick={handleSwapReversedRate}>
              <SwapHorizIcon />
            </IconButton>
            <b>
              {isReversedRate &&
                (reversedRate > 1
                  ? reversedRate.toFixed(3)
                  : reversedRate == 0
                    ? reversedRate.toFixed(0)
                    : reversedRate.toFixed(8))}
              {!isReversedRate &&
                (rate > 1 ? rate.toFixed(3) : rate == 0 ? rate.toFixed(0) : rate.toFixed(8))}{' '}
              {isReversedRate && displayedCurrenciesReversedRate}
              {!isReversedRate && displayedCurrenciesOriginalRate}
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
